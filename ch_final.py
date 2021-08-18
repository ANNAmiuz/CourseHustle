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
        self.studentid = "" #inspect it
        self.password = ""
        self.timestamp = 0
        self.vtoken = ""
        self.baseURL = "http://xsxk.cuc.edu.cn/xsxkapp"
        self.login()
        #self.getcourses()

    def get_ts(self):
        t = datetime.datetime.now()
        return str(datetime.datetime.timestamp(t)*1000)

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
            self.v_code = input("请输入验证码 > ")

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
            self.token = json.loads(res.text)['data']['token']
            print(self.token)
        else:
            print("Login Error")
            os._exit(0)

    def sessionPost(self,url,title,params):
        url = self.baseURL + url
        params = {title:json.dumps(params)}        
        return requests.post(url, data = params, headers = {"token":self.token}, cookies = self.cookies)

    def sessionGet(self,url,params):
        url = self.baseURL + url       
        return requests.get(url, params = params, headers = {"token":self.token}, cookies = self.cookies)
    
    def getcourses(self):
        self.courseIDs = []
        n = int(input("Enter the number of courses you want the program to pick for you:"))
        for i in range(0,n):
            currentID = input("Enter the course ID for your desired courses:")
            self.courseIDs.append(currentID)

    def getTerm(self):
        url = '/sys/xsxkapp/student/%s.do'%self.studentid
        params = {'timestamp':self.get_ts()}
        res = self.sessionGet(url,params).text
        terms = []
        try:
            dataset = json.loads(res)['data']['electiveBatchList']
            for data in dataset:
                terms.append({"name":data['schoolTermName'],"code":data['code']})
        except Exception as e:
            print(res)
            print(e)
        return terms

    def selectTerm(self):
        self.term = '41829609f49346abb8cd29e10ef86fdd'
        terms = self.getTerm()
        print("Index\tName\n")
        for i in range(len(terms)):
            print("[%d]\t%s\n"%(i,terms[i]['name']))
        if len(terms)>0:
            while True:
                try:
                    self.term = terms[int(input("Please input the index to select > "))]['code']
                except:
                    print("Invalid input, try again\n")
                break
        
    def selectCourse(self):
        self.rsections = []
        while True:
            user = input("Input course keyword, quit and save with ':q' > ")
            if user==':q':
                break
            else:
                courses = self.queryRecommended(keyword=user,batch = self.term, studentid = self.studentid)
                self.realSelectCourse(courses)

    def queryRecommended(self, keyword, require_not_full=False, require_no_conflict=False,
        studentid="2019302160216",batch = "41829609f49346abb8cd29e10ef86fdd",
        class_type = "FANKC"):
        checkCapacity = "2"
        checkConflict = "2"
        if require_not_full:
            checkCapacity = "0"
        if require_no_conflict:
            checkConflict = "0"
        url =  "/sys/xsxkapp/elective/recommendedCourse.do"
        params = {"data":{"studentCode":studentid,"campus":"11",
        "electiveBatchCode":batch,"isMajor":"1",
        "teachingClassType":class_type,"checkConflict":checkConflict,
        "checkCapacity":checkConflict,
        "queryContent":keyword},"pageSize":"20","pageNumber":"0","order":""}
        res = self.sessionPost(url,'querySetting',params)
        dataset = json.loads(res.text)
        dataset = dataset['dataList']
        courses = []
        for course in dataset:
            sections = []
            for section in course['tcList']:
                is_major = "1"
                if course["majorFlag"]!='主':
                    is_major = "0"
                sections.append({"id":section['teachingClassID'],
                    'lecturer':section['teacherName'],'venue':section['teachingPlace'],
                    'course_name':course['courseName'],'is_major':is_major})
            courses.append({"name":course['courseName'],"sections":sections})

        return courses

    def realSelectCourse(self,courses):
        print("Index\t\tCourse Name\n")
        for i in range(len(courses)):
            print("[%d]\t\t%s\n"%(i,courses[i]['name']))
        selected_courses = []
        if len(courses)>0:
            keep = True
            while keep:
                try:
                    user = input("You can select multiple courses,finally with ':w' > ")
                    if user==':w':
                        keep = False
                    else:
                        selected_courses.append(courses[int(user)])
                except:
                    print("Invalid input, try again\n")
                    keep = True
        print("Index\tCourse Name\tLecuter\tVenue")
        for selected_course in selected_courses:
            sections = selected_course["sections"]
            for i in range(len(sections)):
                print("[%d]\t%s\t%s\t%s\n"%(i,
                    sections[i]['course_name'],sections[i]['lecturer'],
                    sections[i]['venue']))
            if len(sections)>0:
                keep = True
                while keep:
                    try:
                        user = input("Please select section:")
                        self.rsections.append(sections[int(user)])
                        keep = False
                    except:
                        print("Invalid input, try again\n")

    def manual_selection(self):
        self.msections = []
        self.mkeywords = []
        while True:
            user = input("Input course keyword, quit and save with ':q' > ")
            if user==':q':
                break
            else:
                self.mkeywords.append(user)


    def confirm_selection(self):
        print("This is your course list \n")
        print("Index\tCourse Name\tLecuter\tVenue")
        for i in range(len(self.rsections)):
            print("[%d]\t%s\t%s\t%s\n"%(i,
                self.rsections[i]['course_name'],self.rsections[i]['lecturer'],
                self.rsections[i]['venue']))
        user = input("Input :r to reset, anything else to confirm > ")
        if(user==':r'):
            self.selectCourse()

    # for each ID:
    def selectSingleCourse(self, rsection):
        url = "/sys/xsxkapp/elective/volunteer.do"
        success = 0
        studentCode = self.studentid
        electiveBatchCode = self.term
        teachingClassId = rsection['id']
        isMajor = rsection['is_major']
        while success == 0:
            params = {"data": {"operationType": "1", "studentCode": studentCode, "electiveBatchCode": electiveBatchCode,
                            "teachingClassId": teachingClassId, "isMajor":isMajor , "campus": "11", "teachingClassType": "FANKC"}}
            # print(addParam)
            # res = requests.post(self.baseURL+"/sys/xsxkapp/elective/volunteer.do", data = addParam, headers = {"token":self.token}, cookies = self.cookies)
            res = self.sessionPost(url,'addParam',params)
            print(res.text)
            # how to judge success = 1? what is isMajor? What is campus? where should it pass the token?
            #rest for 2 secs
            time.sleep(self.single_interval)

    # multi-threading for all IDs
    def pickCourses(self):
        threads = []
        for i in self.rsections:
            t1 = threading.Thread(target=self.selectSingleCourse, args=(i,))
            threads.append(t1)

        for t in threads:
            t.setDaemon(True)
            t.start()

        while True:
            time.sleep(self.mul_interval)


    def manual_search(self, keyw):
        secs=[]
        courses = self.queryRecommended(keyw, require_not_full=True, require_no_conflict=True,
        studentid=self.studentid,batch = self.term,class_type = "FANKC")
        for course in courses:
            for section in course['section']:
                secs.append(section['id'])
        return secs

    def mselectSingleCourse(self, keyw):
        while True:
            url = "/sys/xsxkapp/elective/volunteer.do"
            success = 0
            studentCode = self.studentid
            electiveBatchCode = self.term
            secs = self.manual_search(keyw)
            if not len(secs):
                print("No available courses so far for %s, skipped."%keyw)
            for sec in secs:
                teachingClassId = sec['id']
                isMajor = sec['is_major']
                params = {"data": {"operationType": "1", "studentCode": studentCode, "electiveBatchCode": electiveBatchCode,
                                "teachingClassId": teachingClassId, "isMajor":isMajor , "campus": "11", "teachingClassType": "FANKC"}}
                # print(addParam)
                # res = requests.post(self.baseURL+"/sys/xsxkapp/elective/volunteer.do", data = addParam, headers = {"token":self.token}, cookies = self.cookies)
                res = self.sessionPost(url,'addParam',params)
                print(res.text)
                # how to judge success = 1? what is isMajor? What is campus? where should it pass the token?
                #rest for 2 secs
            time.sleep(self.single_interval)


    # multi-threading for all keywords
    def mpickCourses(self):
        threads = []
        for i in self.mkeywords:
            t1 = threading.Thread(target=self.mselectSingleCourse, args=(i,))
            threads.append(t1)

        for t in threads:
            t.setDaemon(True)
            t.start()

        while True:
            time.sleep(self.mul_interval)

    def autoAdd(self):
        self.selectCourse()
        self.confirm_selection()
        self.pickCourses()
    def manualAdd(self):
        self.manual_selection()
        self.mpickCourses()
    def modeSwitch(self):
        if input("Input put 1 for auto mode, 2 for manual mode > ")=="2":
            self.manualAdd()
        else:
            self.autoAdd()

student = Student()
student.single_interval = 53
student.mul_interval = 1000
student.selectTerm()
# student.selectCourse()
# student.confirm_selection()
# student.pickCourses()
student.modeSwitch()
#student.queryRecommended(" 2161030008")
#student.getcourses()
#student.pickCourses()
#student.selectSingleCourse(1)


