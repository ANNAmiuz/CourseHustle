import base64
import json 
import requests
import html
import os   
import threading    
from PIL import Image
import time
import datetime


class Student:

    def __init__(self):
        self.studentid = "2019302160216"
        self.password = "MDU5ODIzNjczQTJFQjFFREM0QjExRDA3MzQ0NThBNkY="
        self.timestamp = 0
        self.vtoken = ""
        self.baseURL = "http://xsxk.cuc.edu.cn/xsxkapp"
        self.login()
        #self.getcourses()

    def login(self):

        res = requests.get(
            "http://xsxk.cuc.edu.cn/xsxkapp/sys/xsxkapp/student/4/vcode.do?timestamp=1625642601000")
        dict = json.loads(res.text)
        self.vtoken = dict["data"]["token"]
        print(self.vtoken)

        res = requests.get(
            "http://xsxk.cuc.edu.cn/xsxkapp/sys/xsxkapp/student/vcode/image.do?vtoken="+self.vtoken)

        with open("captcha.jpg", "wb") as file:
            file.write(res.content)
            file.close()

            try:
                im = Image.open("captcha.jpg")
                im.show()
                im.close()
            except:
                print("error")
            self.v_code = input("请输入验证码:")

        t = datetime.datetime.now()
        self.stamp = datetime.datetime.timestamp(t)*1000

        data = {
            "loginName": self.studentid,
            "loginPwd": self.password,
            "verifyCode": self.v_code,
            "timestrap": self.timestamp,
            "vtoken": self.vtoken
        }
        res = requests.get(
            self.baseURL+"/sys/xsxkapp/student/check/login.do", params=data)
        if res.status_code == 200:
            self.cookies = res.cookies
            print(res.text)
        else:
            print("Login Error")
            os._exit(0)

    def getcourses(self):
        self.courseIDs = []
        n = int(input("Enter the number of courses you want the program to pick for you:"))
        for i in range(0,n):
            currentID = input("Enter the course ID for your desired courses:")
            self.courseIDs.append(currentID)

    # for each ID:
    def selectSingleCourse(self, courseId):
        success = 0
        while success == 0:
            param = {"data": {"operationType": "1", "studentCode": "2019302160216", "electiveBatchCode": "e0ae6c609db740e9909ca83fe5daa748",
                            "teachingClassId": "20212022"+str(courseId)+"01", "isMajor": "1", "campus": "11", "teachingClassType": "TJKC"}}
            res = requests.post(self.baseURL+"/sys/xsxkapp/elective/volunteer.do", data = param, headers = {"token":self.vtoken}, cookies = self.cookies)
            print(res.text)
            # how to judge success = 1? what is isMajor? What is campus? where should it pass the token?
            #rest for 2 secs
            time.sleep(200)

    # multi-threading for all IDs
    def pickCourses(self):
        threads = []
        for i in self.courseIDs:
            t1 = threading.Thread(target=self.selectSingleCourse, args=(i,))
            threads.append(t1)

        for t in threads:
            t.setDaemon(True)
            t.start()

        while True:
            time.sleep(1000)

student = Student()
student.getcourses()
student.pickCourses()
#student.selectSingleCourse(1)


