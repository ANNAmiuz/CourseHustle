import json 
import requests
import time
import cv2
import numpy as np
import os
import sys
import glob
SAMPLE_SIZE = 1000
RAW_PATH = 'tmp'
CHAR_PATH = 'Archive/char'
TRAINED_PATH = 'Archive/trained'
MODEL_PATH = 'Archive/trained/KNN_Trained_Model.xml'
def fetch():
    for i in range(SAMPLE_SIZE):
        res = requests.get(
            "http://xsxk.cuc.edu.cn/xsxkapp/sys/xsxkapp/student/4/vcode.do?timestamp=1625642601000")
        dict = json.loads(res.text)
        vtoken = dict["data"]["token"]
        print(vtoken)
        res = requests.get(
            "http://xsxk.cuc.edu.cn/xsxkapp/sys/xsxkapp/student/vcode/image.do?vtoken="+vtoken)
        with open("%s/%d.jpg"%(RAW_PATH,i), "wb") as file:
            file.write(res.content)
            file.close()
        time.sleep(1)

def process(index):
    filepath = "%s/%d.jpg"%(RAW_PATH,index)
    im = cv2.imread(filepath,cv2.IMREAD_GRAYSCALE)
    x1=2
    x2=26
    y1=0
    y2=70
    im = im[x1:x2, y1:y2]
    ret, im_inv = cv2.threshold(im,180,255,cv2.THRESH_BINARY_INV)
    contours, hierarchy = cv2.findContours(im_inv, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    result = []
    contour = im_inv
    x, y, w, h = cv2.boundingRect(contour)
    box0 = np.int0([[x,y], [x+w/4,y], [x+w/4,y+h], [x,y+h]])
    box1 = np.int0([[x+w/4,y], [x+w*2/4,y], [x+w*2/4,y+h], [x+w/4,y+h]])
    box2 = np.int0([[x+w*2/4,y], [x+w*3/4,y], [x+w*3/4,y+h], [x+w*2/4,y+h]])
    box3 = np.int0([[x+w*3/4,y], [x+w,y], [x+w,y+h], [x+w*3/4,y+h]])
    result.extend([box0, box1, box2, box3])
    for box in result:
        roi = im_inv[box[0][1]:box[3][1], box[0][0]:box[1][0]]
        roistd = cv2.resize(roi, (30, 30))
        timestamp = int(time.time() * 1e6)
        filename = "{}.jpg".format(timestamp)
        filepath = "%s/%s"%(CHAR_PATH,filename)
        # print("ress")
        cv2.imwrite(filepath, roistd)
def mark():
    files = os.listdir("%s"%CHAR_PATH)
    for filename in files:
        filename_ts = filename.split(".")[0]
        patt = "%s/%s_*"%(TRAINED_PATH,filename_ts)
        saved_num = len(glob.glob(patt))
        if saved_num == 1:
            print("{} done".format(patt))
            continue
        filepath = "%s/%s"%(CHAR_PATH, filename)
        im = cv2.imread(filepath)
        cv2.imshow("image", im)
        key = cv2.waitKey(0)
        if key == 27:
            cv2.destroyAllWindows()
            cv2.waitKey(1)
            return
        if key == 13:
            continue
        char = chr(key)
        filename_ts = filename.split(".")[0]
        outfile = "{}_{}.jpg".format(filename_ts, char)
        outpath = "%s/%s"%(TRAINED_PATH, outfile)
        cv2.imwrite(outpath, im)

def train():
    filenames = os.listdir("%s"%TRAINED_PATH)
    samples = np.empty((0, 900))
    labels = []
    for filename in filenames:    
        filepath = "%s/%s"%(TRAINED_PATH, filename)
        label = filename.split(".")[0].split("_")[-1]
        labels.append(label)
        im = cv2.imread(filepath, cv2.IMREAD_GRAYSCALE)
        sample = im.reshape((1, 900)).astype(np.float32)
        samples = np.append(samples, sample, 0)
        samples = samples.astype(np.float32)
        unique_labels = list(set(labels))
        unique_ids = list(range(len(unique_labels)))
        label_id_map = dict(zip(unique_labels, unique_ids))
        id_label_map = dict(zip(unique_ids, unique_labels))
        label_ids = list(map(lambda x: label_id_map[x], labels))
        label_ids = np.array(label_ids).reshape((-1, 1)).astype(np.float32)
    model = cv2.ml.KNearest_create()
    model.train(samples, cv2.ml.ROW_SAMPLE, label_ids)
    model.save(MODEL_PATH)

def solve(model,path):
    filepath = path
    im = cv2.imread(filepath,cv2.IMREAD_GRAYSCALE)
    x1=2
    x2=26
    y1=0
    y2=70
    im = im[x1:x2, y1:y2]
    ret, im_inv = cv2.threshold(im,180,255,cv2.THRESH_BINARY_INV)
    contours, hierarchy = cv2.findContours(im_inv, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    result = []
    contour = im_inv
    x, y, w, h = cv2.boundingRect(contour)
    box0 = np.int0([[x,y], [x+w/4,y], [x+w/4,y+h], [x,y+h]])
    box1 = np.int0([[x+w/4,y], [x+w*2/4,y], [x+w*2/4,y+h], [x+w/4,y+h]])
    box2 = np.int0([[x+w*2/4,y], [x+w*3/4,y], [x+w*3/4,y+h], [x+w*2/4,y+h]])
    box3 = np.int0([[x+w*3/4,y], [x+w,y], [x+w,y+h], [x+w*3/4,y+h]])
    result.extend([box0, box1, box2, box3])
    captcha_char = ""
    for box in result:
        roi = im_res[box[0][1]:box[3][1], box[0][0]:box[1][0]]
        roistd = cv2.resize(roi, (30, 30))
        sample = roistd.reshape((1, 900)).astype(np.float32)
        ret, results, neighbours, distances = model.findNearest(sample, k = 3)
        label_id = int(results[0,0])
        label = id_label_map[label_id]
        captcha_char = captcha_char + label
    return captcha_char
def op_fetch_process():
    SAMPLE_SIZE = int(input("Sample size > "))
    RAW_PATH = input("Raw path, no ending slash > ")
    CHAR_PATH = input("Path to hold processed images, no ending slash > ")
    fetch()
    for i in range(SAMPLE_SIZE):
        process(i)

def op_mark():
    CHAR_PATH = input("Chracter images path, no ending slash > ")
    TRAINED_PATH = input("Path to hold marked images, no ending slash > ")
    mark()

def op_train():
    TRAINED_PATH = input("Marked image path, no ending slash > ")
    MODEL_PATH = input("Path to hold trained model file, better ending with .xml > ") 
    train()

def op_solve():
    MODEL_PATH = input("Trained model xml file path > ")     
    captcha = input("Captcha file path to solve > ")
    model = cv2.ml.KNearest_load(MODEL_PATH)
    res = solve(model,captcha)
    print(res)


def main():
    operations = [("Fetch and Process",op_fetch_process),("Mark Images",op_mark),
    ("Train and Export Model",op_train),("Solve Captcha",op_solve)]
    while 1:
        print("Philip's CAPTCHA solver")
        print("Select an operation > ")
        print("=====================================")
        for i in range(len(operations)):
            print("[%d]\t\t%s"%(i,operations[i][0]))
        print("[%d]\t\t%s"%(i+1,"Exit"))
        print("=====================================")
        try:
            user = int(input(">>> "))
            if(user>=0 and user<len(operations)):
                operations[user][1]()
            else:
                return
        except Exception as e:
            return
main()