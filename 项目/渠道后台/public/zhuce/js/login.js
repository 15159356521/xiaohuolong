/********鐧诲綍********/
function login() {
  // 鍒ゆ柇鏄惁鍕鹃€夊崗璁�
  var terms = document.getElementById("terms").checked;
  if (!terms) {
    // return layertest('璇烽€夋嫨鍚屾剰鏉℃');
    return (document.getElementById("thz-m-layer1").style.display = "block");
  }
  var mobile = $("#mobile").val();
  var uid = "";
  var code = $("#code").val();
  //鍚戝悗鍙板彂閫佸鐞嗘暟鎹�
  $.ajax({
    type: "POST", //鐢≒OST鏂瑰紡浼犺緭
    dataType: "JSON", //鏁版嵁鏍煎紡:JSON
    url: "thc/login", //鐩爣鍦板潃
    data: "phone=" + mobile + "&verify_code=" + code,
    error: function (data) {},
    success: function (data) {
      layertest(data.msg);
      if (data.code == 0) {
        window.location.href = "/";
      }
    },
  });
}

/********鍙戦€侀獙璇佺爜*******/
var addInterValObj; //timer鍙橀噺锛屾帶鍒舵椂闂�
var adcount = 60; //闂撮殧鍑芥暟锛�1绉掓墽琛�
var addCount; //褰撳墠鍓╀綑绉掓暟

function sendMes() {
  var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
  var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
  var item = 1;
  if (!item) {
    return layertest("璇疯緭鍏ユ湁鏁堢殑鎵嬫満鍙风爜");
  } else {
    addCount = adcount;
    //璁剧疆button鏁堟灉锛屽紑濮嬭鏃�
    $("#send-code").attr("disabled", "true");
    $("#send-code").val("" + addCount + "绉掑悗閲嶆柊鑾峰彇");
    addInterValObj = window.setInterval(setAddnTime, 1000); //鍚姩璁℃椂鍣紝1绉掓墽琛屼竴娆�
    var dealType = "";
    var mobile = $("#mobile").val();

    //鍚戝悗鍙板彂閫佸鐞嗘暟鎹�
    $.ajax({
      type: "POST", //鐢≒OST鏂瑰紡浼犺緭
      dataType: "JSON", //鏁版嵁鏍煎紡:JSON
      url: "/thc/send-code", //鐩爣鍦板潃
      data: "mobile=" + mobile,
      error: function (data) {},
      success: function (data) {
        layertest(data.msg);
      },
    });
  }
}

//timer澶勭悊鍑芥暟
function setAddnTime() {
  if (addCount == 0) {
    window.clearInterval(addInterValObj); //鍋滄璁℃椂鍣�
    $("#send-code").removeAttr("disabled"); //鍚敤鎸夐挳
    $("#send-code").val("閲嶆柊鑾峰彇楠岃瘉鐮�");
  } else {
    addCount--;
    $("#send-code").val("" + addCount + "绉掑悗閲嶆柊鑾峰彇");
  }
}

function telphone() {
  var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
  var item = 1;
  if (!item) {
    layertest("请输入有效的手机号码");
    $(".login_ipt").addClass("error");
    return false;
  } else {
    $(".login_ipt").removeClass("error");
  }
}
$(document).on("blur", ".login_ipt", function () {
  telphone();
});

function layertest(content) {
  layer.open({
    content: content,
    btn: "我知道了",
  });
}
//layer loading
function loading(content) {
  layer.open({
    type: 2,
    content: content,
  });
}

// update btn click
$(document).on("click", ".updateBtn", function () {
  if ($(".error").length > 0) {
    layertest("璇锋偍濉啓姝ｇ‘鐨勮祫鏂�");
  } else {
    loading("璺宠浆涓�");
  }
});
