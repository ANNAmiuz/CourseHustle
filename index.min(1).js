var sessionId = "",
    electiveState = "0";
(function (e) {
    function t(e) {
        var t = e.beginTime,
            n = e.endTime,
            i = e.currentTime;
        t = t.replace(new RegExp(/-/gm), "/"),
            n = n.replace(new RegExp(/-/gm), "/"),
            i = i.replace(new RegExp(/-/gm), "/");
        var c = new Date(t),
            a = new Date(n),
            o = new Date(i),
            l = 0,
            s = $("#timeMsg"),
            r = $("#stateMsg");
        o < c ? (l = c.getTime() / 1e3 - o.getTime() / 1e3, s.html("距离开始"), r.html("未开始"), electiveState = "0") : o > c && o < a ? (l = a.getTime() / 1e3 - o.getTime() / 1e3, s.html("距离结束"), r.html("进行中"), electiveState = "1") : (l = 0, s.html("已结束"), r.html("已结束"), electiveState = "2"),
            $("#cvFlipClock").FlipClock(l, {
                clockFace: "DailyCounter",
                showSeconds: !1,
                language: "Chinese",
                countdown: !0
            })
    }
    e.init = function (e) {
        t(e)
    }
})(window.CVFlipClock = window.CVFlipClock || {}),
    function (e) {
        function t(e, t) {
            var n = "",
                i = $("#tpl-notice-list-item").html(),
                c = t.length;
            if (c > 0) {
                var a = 7;
                c = c > a ? a : c;
                for (var o = 0; o < c; o++) {
                    var l = t[o],
                        s = l.title,
                        r = l.timeDescription;
                    null != r && "" != r || (r = "...");
                    var v = l.wid;
                    null != s && "" != s && null != v && "" != v && (n += i.replace("@title", s).replace("@caption", r).replace("@id", v))
                }
                e.html(n)
            } else
                e.next("div").hide()
        }
        function n(e, t) {
            var n = "",
                i = $("#tpl-problem-list-item").html(),
                c = t.length;
            if (c > 0) {
                var a = 3;
                c = c > a ? a : c;
                for (var o = 0; o < c; o++) {
                    var l = t[o],
                        s = l.title,
                        r = l.content,
                        v = r;
                    r.length > 25 && (r = r.substring(0, 25) + ".."),
                        null != s && "" != s && null != r && "" != r && (n += i.replace("@title", s).replace("@contentTitle", v).replace("@caption", r))
                }
                e.html(n)
            } else
                e.next("div").hide()
        }
        e.init = function (e, i, c) {
            "notice" == c ? t(e, i) : "problem" == c && n(e, i)
        }
    }(window.CVIndexList = window.CVIndexList || {}),
    function (e) {
        function t(e, t) {
            var n = "",
                i = t.unitName;
            null == i && (i = "暂无");
            var c = t.callPhoneNumber,
                a = "";
            null == c ? c = "暂无" : a = c,
                c.length > 35 && (c = c.substring(0, 35) + "..");
            var o = t.phoneNumber,
                l = "";
            null == o ? o = "暂无" : l = o,
                o.length > 35 && (o = o.substring(0, 35) + "..");
            var s = t.email,
                r = "";
            null == s ? s = "暂无" : r = s,
                s.length > 35 && (s = s.substring(0, 35) + "..");
            var v = t.qqNumber,
                d = "";
            null == v ? v = "暂无" : d = v,
                v.length > 35 && (v = v.substring(0, 35) + "..");
            var u = $("#consultMethod-list-item").html();
            n += u.replace("@unitName", i).replace("@callPhoneNumberTitle", a).replace("@callPhoneNumber", c).replace("@phoneNumberTitle", l).replace("@phoneNumber", o).replace("@emailTitle", r).replace("@email", s).replace("@qqNumberTitle", d).replace("@qqNumber", v),
                e.html(n)
        }
        e.init = function (e, n) {
            t(e, n),
                sessionStorage.setItem("copyright", n.copyright)
        }
    }(window.CMData = window.CMData || {}),
    function (e) {
        function t(e, t) {
            var n = "",
                i = $("#tpl-stundent-information").html(),
                c = null,
                a = t.gender;
            c = null != a && "1" == a ? resUrl + "/public/images/user/male56_76.png" : resUrl + "/public/images/user/female56_76.png";
            var o = "";
            "02" == t.batchType && (o = "cv-v-hide");
            var l = t.grade;
            l = null == l ? "无年级" : l;
            var s = t.departmentName;
            s = null == s ? "无院系" : s;
            var r = t.collegeName;
            r = null == r ? "无学院" : r,
                n += i.replace("@name", t.name).replace("@number", t.number).replace(/@echartDisplay/g, o).replace("@learners", l + "级").replace("@headImageUrl", c).replace("@department", s).replace("@college", r),
                e.html(n);
            var v = $("#courseBtn"),
                d = sessionStorage.getItem("currentCampus"),
                u = t.electiveBatch;
            if (null != u && null != d) {
                var g = u.name,
                    m = u.typeCode,
                    h = sessionStorage.getItem("electiveIsOpen");
                null != h && "1" == h ? (v.html("开始选课"), v.attr("title", g)) : v.html("查看选课"),
                    v.off("click").on("click", function () {
                        var e = sessionStorage.token,
                            n = "";
                        "02" == t.batchType ? n = BaseUrl + "/sys/xsxkapp/*default/expcurriculavariable.do?token=" + e : "01" == m ? n = BaseUrl + "/sys/xsxkapp/*default/curriculavariable.do?token=" + e : "02" == m && (n = BaseUrl + "/sys/xsxkapp/*default/grablessons.do?token=" + e),
                            window.location.href = n
                    })
            } else
                null == d ? (v.html("没有校区数据"), v.attr("disabled", "disabled")) : (v.html("没有选课信息"), v.attr("disabled", "disabled"));
            var f = {
                xh: t.code,
                xklcdm: t.electiveBatch.code,
                xklclx: t.electiveBatch.batchType
            };
            "02" != t.batchType && queryXkxf(f).done(function (e) {
                if ("1" == e.code) {
                    var t = e.data.totalCredit,
                        n = e.data.getCredit,
                        i = e.data.needCredit,
                        c = [{
                            num: null == t ? 0 : t,
                            name: "总学分"
                        }, {
                            num: null == n ? 0 : n,
                            name: "已获学分"
                        }, {
                            num: null == i ? 0 : i,
                            name: "已选学分"
                        }],
                        a = document.getElementById("cvCreditChart");
                    Xfimage.draw(a, c);
                    var o = [{
                        num: null == t ? 0 : t,
                        name: "总学分"
                    }, {
                        num: null == i ? 0 : i,
                        name: "已选学分"
                    }];
                    Xfimage.drawInfo("#cvCreditInfo", o)
                }
            })
        }
        e.init = function (e, n) {
            t(e, n)
        }
    }(window.CVStundetInfoData = window.CVStundetInfoData || {}),
    function (e) {
        function t(e) {
            if (e && 0 !== e.length) {
                var t = $("#tpl-stage-axis-block").html(),
                    n = e.length;
                n > 3 && (n = 3);
                for (var i = "", c = 0; c < n; c++) {
                    var a = e[c],
                        o = a.beginTime,
                        l = a.endTime,
                        s = a.name,
                        r = "1" == a.active ? "cv-active" : "";
                    i += t.replace("@start", o).replace("@end", l).replace("@name", s).replace("@activeClass", r)
                }
                $("#cvStageAxis").html(i),
                    $.each($("#cvStageAxis .cv-line"), function () {
                        $(this).height($(this).prev().height())
                    })
            }
        }
        e.init = function (e) {
            t(e)
        }
    }(window.CVStageAxis = window.CVStageAxis || {}),
    function (e) {
        function t(e) {
            $("#studentLoginBtn").on("click", function (e) {
                CVStudentLogin.login()
            })
        }
        function n(e) {
            $(".seeMore").on("click", function (e) {
                var t = $(e.currentTarget),
                    n = t.attr("type");
                window.open(BaseUrl + "/sys/xsxkapp/*default/publicinfo.do?type=" + n)
            })
        }
        function i() {
            $(document).keydown(function (e) {
                if (13 == e.keyCode) {
                    var t = sessionStorage.getItem("token");
                    null != t && "" != t || CVStudentLogin.login()
                }
            })
        }
        function c() {
            var e = $("#logout");
            e.hide(),
                e.on("click", function (e) {
                    var t = JSON.parse(sessionStorage.getItem("studentInfo"));
                    if (null != t) {
                        var n = new Object;
                        n.title = "确定退出",
                            n.content = "确定退出系统吗？",
                            CVDialog.show(n)
                    }
                })
        }
        e.init = function () {
            n(),
                i(),
                c(),
                t()
        }
    }(window.CVBindingEvents = window.CVBindingEvents || {}),
    function (e) {
        function t(e) {
            var t = '<div id="cvDialog" class="cv-dialog cv-success"><div><div class="cv-body"><img class="cv-mb-16" src="public/images/curriculaVariable/dialog-icon.png"><h2 class="cv-mb-8">@title</h2><div>@content</div></div><div class="cv-foot"><div class="cv-sure cvBtnFlag">确认</div></div></div></div>',
                n = e.title,
                i = e.content,
                c = t.replace("@title", n).replace("@content", i),
                a = $(c);
            $("body").append(a),
                a.on("click", ".cvBtnFlag", function () {
                    "cas" == loginType ? window.location.href = casUrlOut : window.location.reload()
                })
        }
        function n(e) {
            var t = '<div id="cvDialog" class="cv-dialog cv-danger"><div><div class="cv-body"><img class="cv-mb-16" src="public/images/curriculaVariable/dialog-icon.png"><h2 class="cv-mb-8">@title</h2><div>@content</div></div><div class="cv-foot"><div class="cv-sure cvBtnFlag">确认</div></div></div></div>',
                n = e.title,
                i = e.content,
                a = t.replace("@title", n).replace("@content", i),
                o = $(a);
            $("body").append(o),
                o.on("click", ".cvBtnFlag", function () {
                    e.callback ? e.callback() : c($(this))
                })
        }
        function i(e, t) {
            var n = '<div id="cvDialog" class="cv-dialog"><div><div class="cv-body"><img class="cv-mb-16" src="public/images/curriculaVariable/dialog-icon.png"><h2 class="cv-mb-8">@title</h2><div>@content</div></div><div class="cv-foot"><div class="cv-sure cvBtnFlag" type="sure">确认</div><div class="cv-cancel cvBtnFlag" type="cancel">取消</div></div></div></div>',
                i = e.title,
                a = e.content,
                o = n.replace("@title", i).replace("@content", a),
                l = $(o);
            $("body").append(l),
                l.on("click", ".cvBtnFlag", function () {
                    c($(this), t)
                })
        }
        function c(e, t) {
            var n = e.attr("type");
            "sure" === n ? o(t) : a()
        }
        function a() {
            l()
        }
        function o() {
            s()
        }
        function l() {
            $("#cvDialog").remove()
        }
        function s() {
            var e = JSON.parse(sessionStorage.getItem("studentInfo")),
                n = e.code,
                i = {
                    studentNumber: n
                };
            studentLogOut(i).done(function (e) {
                var n = new Object;
                autoLogOut(),
                    n.title = "成功",
                    n.content = "你已成功退出，请关闭浏览器",
                    sessionStorage.removeItem("token"),
                    sessionStorage.removeItem("studentInfo"),
                    sessionStorage.removeItem("currentBatch"),
                    t(n)
            })
        }
        e.show = function (e, t) {
            i(e, t)
        },
            e.showSuccess = function (e) {
                t(e)
            },
            e.showDanger = function (e) {
                n(e)
            },
            e.remove = function () {
                l()
            }
    }(window.CVDialog = window.CVDialog || {}),
    function (e) {
        function t() {
            queryTestBatch().done(function (e) {
                var t = e.code;
                if (null != t && "1" == t) {
                    var n = e.dataList;
                    if (null != n && n.length > 0) {
                        if ("02" != n[0].batchType) {
                            sessionStorage.setItem("electiveBatchList", JSON.stringify(n));
                            var i = n[0].expElectiveBatch;
                            0 != i.length && $.each(i, function (e, t) {
                                t.active = "1",
                                    n.push(t)
                            })
                        }
                        $("#cv-xklc").attr("class", "cv-clearfix-child");
                        var c = null,
                            a = sessionStorage.getItem("currentBatch");
                        if (a) {
                            c = JSON.parse(a);
                            for (var o = 0, l = n.length; o < l; o++) {
                                var s = n[o];
                                if (s.code == c.code) {
                                    c.currentTime = s.currentTime,
                                        sessionStorage.setItem("currentBatch", JSON.stringify(c));
                                    break
                                }
                            }
                        } else {
                            for (o = 0, l = n.length; o < l; o++) {
                                s = n[o];
                                if ("1" == s.active) {
                                    c = s;
                                    break
                                }
                            }
                            null == c && (c = n[0], c.active = "1")
                        }
                        CVFlipClock.init(c),
                            CVStageAxis.init(n),
                            $("#cvStageName").html(c.name),
                            $("#cvStageStartTime").html(c.beginTime),
                            $("#cvStageEndTime").html(c.endTime),
                            "02" == c.batchType ? $(".lcTimeDisplay").hide() : ($(".lcTimeDisplay").show(), $("#cvStageModeName").html(c.typeName.replace("阶段", "模式")), $("#cvCourseSelectionStrategy").html(c.tacticName))
                    } else
                        $("#noStartDiv").css("display", "block"),
                            $("#cv-xklc .cv-stage-cont").css("display", "none")
                } else
                    $("#noStartDiv").css("display", "block"),
                        $("#cv-xklc .cv-stage-cont").css("display", "none")
            })
        }
        e.init = function () {
            t()
        }
    }(window.CVElectiveBatch = window.CVElectiveBatch || {}),
    function (e) {
        function t() {
            var e = {
                pageSize: 10,
                pageNumber: 1
            };
            queryPublicInfo(e).done(function (e) {
                var t = e.code;
                if (null != t && "1" == t) {
                    var c = e.data,
                        a = c.celebrityFamousList,
                        o = c.commonProblemList,
                        l = c.consultMethod,
                        s = c.noticeList;
                    if ($("#noStartInfo").html(c.stopInfo), null != s && CVIndexList.init($("#cvNotificationList"), s, "notice"), null != o && CVIndexList.init($("#cvProblemList"), o, "problem"), null != l && (CMData.init($("#consultMethod"), l), xsxkpub.changeCopyRight()), null != a && a.length > 0) {
                        var r = i(0, a.length - 1);
                        n(a[r]),
                            sessionStorage.setItem("celebrityFamous", JSON.stringify(a))
                    }
                    $(".publicinfo-title").on("click", function (e) {
                        var t = $(e.currentTarget).attr("id");
                        window.open(BaseUrl + "/sys/xsxkapp/*default/content.do?id=" + t)
                    })
                }
            })
        }
        function n(e) {
            $("#ecDiv").html(e.englishContent),
                $("#cDiv").html(e.content),
                $("#authorDiv").html(e.author)
        }
        function i(e, t) {
            var n = t - e,
                i = Math.random(),
                c = e + Math.round(i * n);
            return c
        }
        e.init = function () {
            t()
        }
    }(window.CVPublicInfo = window.CVPublicInfo || {}),
    function (e) {
        function t() {
            if (o()) {
                var e = $("#loginName").val(),
                    t = $("#loginPwd").val(),
                    i = getDesKeys();
                t = strEnc(t, i[0], i[1], i[2]),
                    t = $.base64.encode(t);
                var c = "",
                    a = sessionStorage.getItem("vodeType");
                if ("1" == a)
                    c = $("#verifyCode").val();
                else {
                    for (var l = JSON.parse(sessionStorage.getItem("verifyResult")), s = 0; s < 4; s++)
                        c += l[s].left + "-" + l[s].top + ",";
                    c.length > 0 && (c = c.substring(0, c.length - 1))
                }
                var r = sessionStorage.getItem("vtoken"),
                    v = new Object;
                v.loginName = e,
                    v.loginPwd = t,
                    v.verifyCode = c,
                    v.vtoken = r;
                var d = (new Date).getTime();
                $.get(BaseUrl + "/sys/xsxkapp/student/check/login.do?timestrap=" + d, v, function (e) {
                    var t = e.code,
                        i = e.data;
                    if (null != t && "1" == t) {
                        var c = i.number,
                            a = i.token;
                        sessionStorage.removeItem("token"),
                            sessionStorage.setItem("token", a),
                            n(c)
                    } else
                        null != t && "2" == t ? ($.bhTip({
                            content: "登录名或密码不正确",
                            state: "danger"
                        }), CVVerifyCode.init()) : null != t && "3" == t ? ($.bhTip({
                            content: "验证码不正确",
                            state: "danger"
                        }), CVVerifyCode.init()) : "4" == t ? ($.bhTip({
                            content: "在线人数超过上限",
                            state: "danger"
                        }), CVVerifyCode.init()) : (e.msg ? $.bhTip({
                            content: e.msg,
                            state: "danger"
                        }) : $.bhTip({
                            content: "系统异常，请稍后重试",
                            state: "danger"
                        }), CVVerifyCode.init())
                })
            }
        }
        function n(e) {
            var t = (new Date).getTime();
            $.ajax({
                type: "get",
                url: BaseUrl + "/sys/xsxkapp/student/" + e + ".do?timestamp=" + t,
                headers: {
                    token: sessionStorage.token
                },
                success: function (e) {
                    var t = e.code;
                    if (null != t && "1" == t) {
                        var n = e.data,
                            o = n.code;
                        if (null == o || "" == o)
                            return void $.bhTip({
                                content: "学籍信息不存在",
                                state: "danger"
                            });
                        CVSystemParam.init();
                        var l = sessionStorage.getItem("studentInfo");
                        if (l && "false" == sessionStorage.getItem("initFlag"))
                            c(JSON.parse(l), JSON.parse(sessionStorage.getItem("currentBatch")));
                        else if (0 == n.electiveBatchList.length && 0 == n.expElectiveBatchList.length)
                            a(o);
                        else if (1 == n.electiveBatchList.length && "1" == n.electiveBatchList[0].canSelect) {
                            var s = n.electiveBatchList[0];
                            "1" != s.needConfirm || "1" == s.needConfirm && "1" == s.isConfirmed ? c(n, n.electiveBatchList[0]) : i(n, n.electiveBatchList, o, n.expElectiveBatchList)
                        } else
                            i(n, n.electiveBatchList, o, n.expElectiveBatchList)
                    } else if ("2" == t) {
                        var r = e.msg;
                        if ("cas" == loginType) {
                            var v = $("#stundentinfoDiv");
                            v.css("display", "block");
                            var d = $("#no_student_info").html();
                            v.html(d),
                                $("#login_error_title").html("登录验证未通过"),
                                $("#login_error_message").html(r),
                                $("#stundentinfoDiv").css("display", "block"),
                                $("#loginDiv").css("display", "none")
                        } else
                            r.length > 19 && $.bhTip({
                                content: r,
                                state: "danger"
                            }),
                                $("#loginDiv").css("display", "block")
                    } else
                        "302" == t ? $.bhTip({
                            content: "未登录用户",
                            state: "danger"
                        }) : $.bhTip({
                            content: "登录失败，请稍后重试",
                            state: "danger"
                        })
                }
            })
        }
        function i(e, t, n, i) {
            for (var o = $("#electiveBatch_list_select").html(), l = $("#expElectiveBatch_list_select").html(), s = "", r = "", v = $(".qhlc-btn").attr("data-code"), d = null, u = null, g = "cv-hide", m = "", h = 0, f = t.length; h < f; h++)
                d = t[h],
                    s += "<tr class='electiveBatch-row'><td class='cv-electiveBatch-operate'>",
                    "1" == d.canSelect && (v == d.code ? (s += "<div><input class='cv-electiveBatch-select' name='electiveBatchSelect' type='radio' data-value='" + JSON.stringify(d) + "' checked='checked' value='' /></div>", m = d.confirmInfo, "1" == d.needConfirm && "1" != d.isConfirmed && (g = "cv-show")) : s += "<div><input class='cv-electiveBatch-select' name='electiveBatchSelect' type='radio' data-value='" + JSON.stringify(d) + "' value='' /></div>"),
                    s += "</td>",
                    s += "<td class='cv-electiveBatch-name'><div>" + d.name + "</div></td>",
                    s += "<td class='cv-electiveBatch-kssj'><div>" + d.beginTime + "</div></td>",
                    s += "<td class='cv-electiveBatch-jssj'><div>" + d.endTime + "</div></td>",
                    s += "<td class='cv-electiveBatch-sfkxq'><div>" + ("1" == d.multiCampus ? "是" : "否") + "</div></td>",
                    s += "<td class='cv-electiveBatch-sfct'><div>" + ("1" == d.noCheckTimeConflict ? "是" : "否") + "</div></td>",
                    s += "<td class='cv-electiveBatch-cause'>",
                    "1" != d.canSelect && (s += "<div>" + d.noSelectReason + "</div>"),
                    s += "</td></tr>";
            if (o = o.replace("@electiveBatchBody", s).replace("@electiveBatchDisplay", g).replace("@confirmInfo", m), i.length > 0) {
                for (h = 0; h < i.length; h++)
                    u = i[h],
                        r += "<tr class='electiveBatch-row'><td class='cv-electiveBatch-operate'>",
                        v == u.code ? r += "<div><input class='cv-electiveBatch-select' name='electiveBatchSelect' type='radio' data-value='" + JSON.stringify(u) + "' checked='checked' value='' /></div>" : r += "<div><input class='cv-electiveBatch-select' name='electiveBatchSelect' type='radio' data-value='" + JSON.stringify(u) + "' value='' /></div>",
                        r += "</td>",
                        r += "<td class='cv-electiveBatch-name'><div>" + u.name + "</div></td>",
                        r += "<td class='cv-electiveBatch-name'><div>" + u.beginTime + "</div></td>",
                        r += "<td class='cv-electiveBatch-name'><div>" + u.endTime + "</div></td>",
                        r += "<td class='cv-electiveBatch-name'><div>" + u.crossCampusName + "</div></td>",
                        r += "<td class='cv-electiveBatch-name'><div>" + u.conflictName + "</div></td>",
                        r += "<td class='cv-electiveBatch-name'><div>" + u.conflictTime + "</div></td>",
                        r += "</td></tr>";
                o += l.replace("@expElectiveBatchBody", r)
            }
            var p = document.documentElement.clientWidth;
            $.xkWindow(o, "选择轮次", [{
                text: "确定",
                className: "bh-btn bh-btn-primary",
                callback: function () {
                    if (0 == $(".cv-electiveBatch-select:checked").length)
                        return $.bhTip({
                            content: "请选择轮次",
                            state: "warning"
                        }), !1;
                    var t = JSON.parse($(".cv-electiveBatch-select:checked").eq(0).attr("data-value"));
                    if ($(".electiveBatchXznr").hasClass("cv-show") && !$(".electiveBatchXznr #tyxz-input").prop("checked"))
                        return $.bhTip({
                            content: "请阅读须知并同意",
                            state: "warning"
                        }), !1;
                    if ($(".electiveBatchXznr").hasClass("cv-show")) {
                        t.isConfirmed = "1",
                            $.each(e.electiveBatchList, function (e, n) {
                                n.code == t.code && (n.isConfirmed = "1")
                            });
                        var n = {
                            electiveBatchCode: t.code,
                            studentCode: e.code
                        };
                        makeSureLcxz(n).done(function (n) {
                            "1" == n.code ? c(e, t) : $.bhTip({
                                content: "修改学生已同意须知的状态失败",
                                state: "danger"
                            })
                        })
                    } else
                        c(e, t)
                }
            }, {
                text: "关闭",
                className: "bh-btn bh-btn-default",
                callback: function () {
                    0 == $(".cv-electiveBatch-select:checked").length && n && a(n)
                }
            }], {
                width: p - 100,
                height: 570,
                closeButtonSize: 0
            });
            var y = 340 - $(".electiveBatch .lc-container").height() - $(".expElectiveBatch").height();
            y < 100 && (y = 100),
                $(".electiveBatchXznr .xznr-content").css({
                    "max-height": y
                }),
                $(".electiveBatch-list-table").off("click").on("click", ".cv-electiveBatch-select", function (e) {
                    var t = JSON.parse($(e.currentTarget).attr("data-value"));
                    "1" == t.needConfirm && "1" != t.isConfirmed ? $(".electiveBatchXznr").removeClass("cv-show").removeClass("cv-hide").addClass("cv-show") : $(".electiveBatchXznr").removeClass("cv-show").removeClass("cv-hide").addClass("cv-hide"),
                        $(".electiveBatchXznr .xznr-content").html(t.confirmInfo)
                }),
                0 == $(".cv-electiveBatch-select:checked").length && $(".cv-electiveBatch-select").length > 0 && $(".cv-electiveBatch-select").eq(0).prop("checked", !0).trigger("click")
        }
        function c(e, t) {
            e.electiveBatch = t,
                sessionStorage.setItem("studentInfo", JSON.stringify(e)),
                sessionStorage.setItem("currentBatch", JSON.stringify(t)),
                sessionStorage.setItem("electiveIsOpen", t.canSelect),
                $(".qhlc-btn").show(),
                $(".qhlc-btn").attr("data-code", t.code),
                CVFlipClock.init(t),
                $("#cvStageName").html(t.name),
                $("#cvStageStartTime").html(t.beginTime),
                $("#cvStageEndTime").html(t.endTime),
                "02" == t.batchType ? $(".lcTimeDisplay").hide() : ($(".lcTimeDisplay").show(), $("#cvStageModeName").html(t.typeName.replace("阶段", "模式")), $("#cvCourseSelectionStrategy").html(t.tacticName)),
                e.batchType = t.batchType;
            var n = new Object,
                i = e.campus;
            null != i && "" != i && (n.code = i, n.name = e.campusName, sessionStorage.setItem("currentCampus", JSON.stringify(n))),
                CVStundetInfoData.init($("#stundentinfoDiv"), e),
                $("#stundentinfoDiv").css("display", "block"),
                $("#loginDiv").css("display", "none");
            var c = $("#logout");
            c.show()
        }
        function a(e) {
            var t = new Object;
            t.title = "警告",
                t.content = "请重新登录！",
                t.callback = function () {
                    var t = {
                        studentNumber: e
                    };
                    studentLogOut(t).done(function (e) {
                        autoLogOut(),
                            sessionStorage.removeItem("token"),
                            sessionStorage.removeItem("studentInfo"),
                            sessionStorage.removeItem("currentBatch"),
                            window.location.reload(),
                            "cas" == loginType ? window.location.href = casUrlOut : window.location.reload()
                    })
                },
                CVDialog.showDanger(t)
        }
        function o() {
            var e = !0,
                t = "",
                n = $("#loginName").val(),
                i = $("#loginPwd").val(),
                c = sessionStorage.getItem("vodeType");
            if ("1" == c) {
                var a = $("#verifyCode").val();
                null == a || 0 == a.length ? ($("#verifyCodeDiv").attr("class", "cv-verification-code cv-danger"), t = "请填写验证码", e = !1) : $("#verifyCodeDiv").attr("class", "cv-verification-code")
            } else {
                var o = JSON.parse(sessionStorage.getItem("verifyResult"));
                4 != o.length ? (t = "请填写验证码", e = !1) : $("#verifyCodeDiv").attr("class", "cv-verification-code")
            }
            return null == i || 0 == i.length ? ($("#loginPwdDiv").attr("class", "cv-danger"), t = "请填写密码", e = !1) : $("#loginPwdDiv").removeAttr("class"), null == n || 0 == n.length ? ($("#loginNameDiv").attr("class", "cv-danger"), t = "请填写用户名", e = !1) : $("#loginNameDiv").removeAttr("class"), "" != t && 0 == e && $.bhTip({
                content: t,
                state: "warning"
            }), e
        }
        e.login = function () {
            t()
        },
            e.studentInfo = function (e) {
                n(e)
            },
            e.openElectiveBatchWindow = function (e, t, n, c) {
                i(e, t, n, c)
            }
    }(window.CVStudentLogin = window.CVStudentLogin || {}),
    function (e) {
        function t() {
            queryDictionary().done(function (e) {
                var t = e.code;
                if (null != t && "1" == t) {
                    var n = e.data;
                    sessionStorage.setItem("dictionary", JSON.stringify(n.dictionaryList)),
                        i(n.dictionaryList)
                }
            })
        }
        function n() {
            var e = querySysParam(),
                t = e.code;
            if (null != t && "1" == t) {
                var n = e.data;
                sessionStorage.setItem("sysParam", JSON.stringify(n));
                var i = sessionStorage.getItem("initTimestamp");
                n.initTimestamp != i ? (sessionStorage.setItem("initFlag", !0), sessionStorage.setItem("initTimestamp", n.initTimestamp)) : sessionStorage.setItem("initFlag", !1)
            }
        }
        function i(e) {
            var t = e.XQ;
            null != t && sessionStorage.setItem("campusList", JSON.stringify(t))
        }
        e.init = function () {
            t(),
                n()
        }
    }(window.CVSystemParam = window.CVSystemParam || {}),
    function (e) {
        function t() {
            var e = sessionStorage.getItem("token"),
                t = sessionStorage.getItem("studentInfo");
            if (null != e && null != t) {
                var n = JSON.parse(t).code;
                CVStudentLogin.studentInfo(n)
            }
        }
        e.init = function () {
            t()
        }
    }(window.CVAutoLogin = window.CVAutoLogin || {}),
    function (e) {
        function t() {
            queryVocdeToken().done(function (e) {
                var c = e.code;
                if (null != c && "1" == c) {
                    var a = e.data,
                        o = a.token;
                    sessionStorage.setItem("vtoken", o),
                        "1" == a.vode ? (sessionStorage.setItem("vodeType", "1"), $(".cv-verification-code").attr("vodeType", "1"), $("#verifyCode").val(""), $("#vcodeImg").off("click").on("click", function () {
                            t()
                        })) : (sessionStorage.setItem("vodeType", "2"), $(".cv-verification-code").attr("vodeType", "2"), sessionStorage.setItem("verifyResult", "[]"), $(".yidun_icon-point").remove(), $("#vcodeImg").off("click").on("click", function (e) {
                            i(e)
                        })),
                        n(o)
                }
            })
        }
        function n(e) {
            var t = $("#vcodeImg");
            t.attr("src", BaseUrl + "/sys/xsxkapp/student/vcode/image.do?vtoken=" + e)
        }
        function i(e) {
            var n = parseInt(e.offsetX),
                i = parseInt(e.offsetY);
            if (n > 215 && i < 20)
                return t(), !1;
            var c = JSON.parse(sessionStorage.getItem("verifyResult"));
            c.length < 4 && ($(e.currentTarget).after('<div class="yidun_icon-point yidun_point-' + (c.length + 1) + '" style="left: ' + (n - 13) + "px; top: " + (i - 33) + 'px;"></div>'), c.push({
                left: n,
                top: i
            }), sessionStorage.setItem("verifyResult", JSON.stringify(c)))
        }
        e.init = function () {
            t()
        }
    }(window.CVVerifyCode = window.CVVerifyCode || {}),
    function (e) {
        function t(e) {
            queryOnlineUsers().done(function (t) {
                var n = t.code;
                if (null != n && "1" == n) {
                    var i = t.data,
                        c = i.onlineUsers;
                    e.html("（当前选课在线人数 " + c + "人）")
                }
            })
        }
        e.init = function () {
            var e = $("#noline-tip");
            t(e)
        }
    }(window.CVOnlineTip = window.CVOnlineTip || {}),
    $(function () {
        CVElectiveBatch.init(),
            CVPublicInfo.init(),
            CVAutoLogin.init(),
            CVBindingEvents.init(),
            CVContentMinHeight.set($(".main").children("article")),
            xsxkpub.changeCopyRight(),
            CVOnlineTip.init(),
            CVVerifyCode.init(),
            CVBarrage.init(),
            $(".qhlc-btn").on("click", function () {
                var e = JSON.parse(sessionStorage.getItem("studentInfo"));
                if (e.electiveBatchList.length + e.expElectiveBatchList.length == 1)
                    $.bhTip({
                        content: "只存在一个轮次，无需切换",
                        state: "warning"
                    });
                else {
                    var t = (new Date).getTime();
                    $.ajax({
                        type: "get",
                        url: BaseUrl + "/sys/xsxkapp/student/" + e.code + ".do?timestamp=" + t,
                        headers: {
                            token: sessionStorage.token
                        },
                        success: function (e) {
                            var t = e.code;
                            if (null != t && "1" == t) {
                                var n = e.data,
                                    i = n.code;
                                if (null == i || "" == i)
                                    return void $.bhTip({
                                        content: "学籍信息不存在",
                                        state: "danger"
                                    });
                                CVStudentLogin.openElectiveBatchWindow(n, n.electiveBatchList, i, n.expElectiveBatchList)
                            } else if ("2" == t) {
                                var c = e.msg;
                                "cas" == loginType ? $.bhTip({
                                    content: "登录验证未通过",
                                    state: "danger"
                                }) : $.bhTip({
                                    content: c,
                                    state: "danger"
                                })
                            } else
                                "302" == t ? $.bhTip({
                                    content: "未登录用户",
                                    state: "danger"
                                }) : $.bhTip({
                                    content: "登录失败，请稍后重试",
                                    state: "danger"
                                })
                        }
                    })
                }
            })
    });

