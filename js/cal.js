;window.onload = function() {
	//DOM元件及locaclStorage資料
	var list = document.getElementById("BMIRecordsList");
	var bmiCalBtn = document.getElementById("submit");	
	var recordData = JSON.parse(localStorage.getItem("bmiRecord")) || [];
	// 更新頁面資料
	updateList(recordData);

	//監聽，驗證及更新
	bmiCalBtn.addEventListener("click", function(e) {
		//取消預設
		e.preventDefault();
		//取得身高、體重及提示訊息
		var heightTextEl = document.getElementById("height");
		var weightTextEl = document.getElementById("weight");
		var heightValue = heightTextEl.value;
		var weightValue = weightTextEl.value;
		var bmiValue;
		var hint = document.querySelector(".hint");
		//驗證身高體重，並設定提示訊息
		if(heightValue === "" || weightValue === "") {
			hint.innerHTML = "請輸入身高及體重";
			return;
		}
		if(!heightValue.match(/^\d{3}$/)){
			hint.innerHTML = "身高輸入有誤，請重新輸入";
			return;
		}
		if(weightValue.match(/^\d{3}$/) || weightValue.match(/^\d{2}$/)){
		}else {
			hint.innerHTML = "體重輸入有誤，請重新輸入";
			return;
		}
		// 清空提示訊息並計算bmi
		hint.innerHTML = "";
		bmiValue = weightValue / Math.pow(heightValue/100, 2);
		bmiValue = bmiValue.toFixed(2);
		// 將資料存入localStorage
		addRecord(heightValue, weightValue, bmiValue);
		
		// 清除輸入資訊
		heightTextEl.value = "";
		weightTextEl.value = "";
	}, false);

	

	//監聽，刪除記錄及更新
	list.addEventListener("click", function(e) {
		// 停止預設
		e.preventDefault();
		// 判定點擊的元素
		if(e.target.tagName !== "A"){return;}
		// 取得刪除元素的索引值
		var index = e.target.dataset.record;
		// 刪除該記錄
		recordData.splice(index, 1);
		// 更新localStorage及頁面資料
		localStorage.setItem("bmiRecord", JSON.stringify(recordData));
		updateList(recordData);
	}, false);

	// functions
	//更新網頁資料
	function updateList(recordDatas) {
		list.innerHTML = "";
		for(var i = recordDatas.length-1; i >= 0; i--) {
			// 建立li元素
			var liEl = document.createElement("LI");
			liEl.setAttribute("class", "data");
			// 建立a元素
			var aEl = document.createElement("A");
			aEl.setAttribute("href", "#!");
			aEl.setAttribute("class", "deleteRecord " + recordDatas[i].resultClass);
			aEl.dataset.record = i;
			liEl.appendChild(aEl);
			// 建立p元素
			var pEl = document.createElement("P");
			pEl.setAttribute("class", "u-ftsize-20");
			pEl.textContent = recordDatas[i].result;
			liEl.appendChild(pEl);
			// 建立div及span元素
			var divEl = document.createElement("DIV");
			divEl.setAttribute("class", "record u-ftsize-12");
			var spanEl = document.createElement("SPAN");
			spanEl.setAttribute("class", "u-mgl-8 u-ftsize-20");
			divEl.textContent = "BMI";
			spanEl.textContent = recordDatas[i].bmi;
			divEl.appendChild(spanEl);
			liEl.appendChild(divEl.cloneNode(true));
			divEl.textContent = "weight";
			spanEl.textContent = recordDatas[i].weight + "kg";
			divEl.appendChild(spanEl);
			liEl.appendChild(divEl.cloneNode(true));
			divEl.textContent = "height";
			spanEl.textContent = recordDatas[i].height + "cm";
			divEl.appendChild(spanEl);
			liEl.appendChild(divEl.cloneNode(true));
			
			// 建立date p元素
			var dateEl = document.createElement("P");
			dateEl.setAttribute("class", "u-ftsize-12");
			dateEl.textContent = recordDatas[i].date;
			liEl.appendChild(dateEl);
			list.appendChild(liEl);
		}
		
	}

	//存入資料
	function addRecord(heightValue, weightValue, bmiValue) {
		// 建立資料物件及當天日期
		var date = new Date();
		var bmiRecord = {
			height: heightValue,
			weight: weightValue,
			bmi: bmiValue,
			date: (date.getMonth()+1) + "-" + date.getDate() + "-" + date.getFullYear(),
			result: "",
			resultClass: ""
		};
		// 判定bmi相應結果
		if(bmiValue < 18.5) {
			bmiRecord.result = "過輕";
			bmiRecord.resultClass = "underweight";
		} else if(bmiValue >= 18.5 && bmiValue < 24) {
			bmiRecord.result = "理想";
			bmiRecord.resultClass = "ideal";
		} else if(bmiValue >= 24 && bmiValue < 27) {
			bmiRecord.result = "過重";
			bmiRecord.resultClass = "overweight";
		} else if(bmiValue >= 27 && bmiValue < 30) {
			bmiRecord.result = "輕度肥胖";
			bmiRecord.resultClass = "mild-obesity";
		} else if(bmiValue >= 30 && bmiValue < 35) {
			bmiRecord.result = "中度肥胖";
			bmiRecord.resultClass = "moderate-obesity";
		} else {
			bmiRecord.result = "重度肥胖";
			bmiRecord.resultClass = "severe-obesity";
		}
		// 增加bmi記錄陣列
		recordData.push(bmiRecord);
		// 存入資料
		localStorage.setItem("bmiRecord", JSON.stringify(recordData));
		// 更新頁面資料
		updateList(recordData);
	}
};