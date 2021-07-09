import json 
import requests
import time
import cv2
import numpy as np
import os
import sys
import glob
BASEPATH = 'Archive'
def fetch():
    for i in range(1000):
        res = requests.get(
            "http://xsxk.cuc.edu.cn/xsxkapp/sys/xsxkapp/student/4/vcode.do?timestamp=1625642601000")
        dict = json.loads(res.text)
        vtoken = dict["data"]["token"]
        print(vtoken)
        res = requests.get(
            "http://xsxk.cuc.edu.cn/xsxkapp/sys/xsxkapp/student/vcode/image.do?vtoken="+vtoken)
        with open("tmp/%d.jpg"%i, "wb") as file:
            file.write(res.content)
            file.close()
        time.sleep(1)

def process(index):
    filepath = "tmp/%d.jpg"%index 
    im = cv2.imread(filepath,cv2.IMREAD_GRAYSCALE)
    x1=2
    x2=26
    y1=0
    y2=70
    im = im[x1:x2, y1:y2]
    # im_gray = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    ret, im_inv = cv2.threshold(im,180,255,cv2.THRESH_BINARY_INV)
    # kernel = 1/16*np.array([[1,2,1], [2,4,2], [1,2,1]])
    # im_blur = cv2.filter2D(im_inv,-1,kernel)
    # ret, im_res = cv2.threshold(im_blur,127,255,cv2.THRESH_BINARY)
    contours, hierarchy = cv2.findContours(im_inv, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    # cv2.drawContours(im_inv, contours, -1, (0,255,0), 3)
    result = []
    # w_max = 0
    # w_min = 100000
    # if(len(contours)==1):
    contour = im_inv
    x, y, w, h = cv2.boundingRect(contour)
    box0 = np.int0([[x,y], [x+w/4,y], [x+w/4,y+h], [x,y+h]])
    box1 = np.int0([[x+w/4,y], [x+w*2/4,y], [x+w*2/4,y+h], [x+w/4,y+h]])
    box2 = np.int0([[x+w*2/4,y], [x+w*3/4,y], [x+w*3/4,y+h], [x+w*2/4,y+h]])
    box3 = np.int0([[x+w*3/4,y], [x+w,y], [x+w,y+h], [x+w*3/4,y+h]])
    result.extend([box0, box1, box2, box3])
    # else:
    #     for contour in contours:
    #         x, y, w, h = cv2.boundingRect(contour)
    #         w_max = max(w_max,w)
    #         w_min = min(w_min,w)
    #     for contour in contours:
    #         x, y, w, h = cv2.boundingRect(contour)
    #             box_left = np.int0([[x,y], [x+w/3,y], [x+w/3,y+h], [x,y+h]])
    #             box_mid = np.int0([[x+w/3,y], [x+w*2/3,y], [x+w*2/3,y+h], [x+w/3,y+h]])
    #             box_right = np.int0([[x+w*2/3,y], [x+w,y], [x+w,y+h], [x+w*2/3,y+h]])
    #             result.append(box_left)
    #             result.append(box_mid)
    #             result.append(box_right)
    #         elif w_max < w_min * 2:
    #             box_left = np.int0([[x,y], [x+w/2,y], [x+w/2,y+h], [x,y+h]])
    #             box_right = np.int0([[x+w/2,y], [x+w,y], [x+w,y+h], [x+w/2,y+h]])
    #             result.append(box_left)
    #             result.append(box_right)
    #         else:
    #             box = np.int0([[x,y], [x+w,y], [x+w,y+h], [x,y+h]])
    #             result.append(box)
    for box in result:
        roi = im_inv[box[0][1]:box[3][1], box[0][0]:box[1][0]]
        roistd = cv2.resize(roi, (30, 30))
        timestamp = int(time.time() * 1e6)
        filename = "{}.jpg".format(timestamp)
        filepath = "tmp/char/%s"%filename
        print("ress")
        cv2.imwrite(filepath, roistd)

def train():
    files = os.listdir("%s/char"%BASEPATH)
    for filename in files:
        filename_ts = filename.split(".")[0]
        patt = "Archive/trained/{}_*".format(filename_ts)
        saved_num = len(glob.glob(patt))
        if saved_num == 1:
            print("{} done".format(patt))
            continue
        filepath = "%s/char/%s"%(BASEPATH, filename)
        im = cv2.imread(filepath)
        cv2.imshow("image", im)
        key = cv2.waitKey(0)
        if key == 27:
            sys.exit()
        if key == 13:
            continue
        char = chr(key)
        filename_ts = filename.split(".")[0]
        outfile = "{}_{}.jpg".format(filename_ts, char)
        outpath = "%s/trained/%s"%(BASEPATH, outfile)
        cv2.imwrite(outpath, im)

train()