from PIL import Image
import requests
import json
import time
import os
import pytesseract

def solveSingleCaptcha():
    res = requests.get(
                    "http://xsxk.cuc.edu.cn/xsxkapp/sys/xsxkapp/student/4/vcode.do?timestamp=1625642601000")
    dict = json.loads(res.text)
    vtoken = dict["data"]["token"]

    res = requests.get(
            "http://xsxk.cuc.edu.cn/xsxkapp/sys/xsxkapp/student/vcode/image.do?vtoken="+vtoken)

    with open("captcha.jpg", "wb") as file:
        file.write(res.content)
        file.close()

        try:
            im = Image.open("captcha.jpg")
            imgry = im.convert('L')
            imgry.save('gray-' + "captcha.jpg")
            threshold = 140
            table = []
            for j in range(256):
                if j < threshold:
                    table.append(0)
                else:
                    table.append(1)
            out = imgry.point(table, '1')
            out.save('b' + "captcha.jpg")
            text = pytesseract.image_to_string(out)
            print("识别结果："+text)
            im.show()
            im.close()
        except:
            print("error")
    
        

solveSingleCaptcha()