import{S as u,_ as R}from"./check-4eca2b24.js";import{_ as B,m as $,r as C,o as r,c as i,a as M,w as I,b as t,d as y,t as c,f as Y,v as S,g as D,F as v,h as k,i as w,n as A,j as E}from"./index-b5c600f8.js";import{i as N,_ as O,a as P}from"./empty-a5bf4fdf.js";const q={components:{DatePicker:N},data(){return{selectedDate:this.$moment().toDate(),startDate:this.$moment().toDate(),endDate:this.$moment().add(1,"days").toDate(),isRange:!1,reverseType:!0,formattedFareData:[],passengerFareData:[],fareCountData:[],formattedDriveData:[],driveData:[],notDriveData:[],formattedPassengerData:[],takeRideData:[],notTakeRideData:[],fareCountTotal:"",amount:null,isLoading:!1,filteredType:"當月車費",category:["當月車費","上月車費","開車登記"]}},methods:{async getFareData(){const{email:o}=this.userInfo,{token:e}=this.$store.state,l={headers:{Authorization:`Bearer ${e}`}};try{const n=await this.$http.post("https://todolist-sql.onrender.com/api/fare/get_driver_passenger_fares",{email:o},l),{found:s,currentMonthFares:d,previousMonthFares:g,passengersResult:m}=n.data;s&&(this.passengerFareData.currentMonthFares=this.formatPassengerFares(d),this.passengerFareData.previousMonthFares=this.formatPassengerFares(g),this.passengerFareData.passengersResult=m,this.filteredType==="上月車費"?this.formattedFareData=this.passengerFareData.previousMonthFares:this.filteredType==="當月車費"&&(this.formattedFareData=this.passengerFareData.currentMonthFares),this.calculateTotalFareCount())}catch(n){console.error("Error:",n)}},formatPassengerFares(o){return o.map(e=>({...e,date:this.$moment(e.date).format("YYYY-MM-DD"),fareCount:e.fareCount.map(l=>({...l,date:this.$moment(l.date).format("YYYY-MM-DD")}))}))},calculateTotalFareCount(){let o=0;this.formattedFareData&&this.formattedFareData.forEach(e=>{o+=e.fare}),o>0?this.fareCountTotal=`匯款收入${o}元`:this.fareCountTotal="尚無紀錄"},async delFareLog(o){if((await u.fire({title:"確認刪除",text:"您確定要刪除這條費用調整記錄嗎？",icon:"warning",showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#808080",confirmButtonText:"刪除",cancelButtonText:"取消"})).isConfirmed){const{token:l}=this.$store.state,n={headers:{Authorization:`Bearer ${l}`}};try{(await this.$http.delete(`https://todolist-sql.onrender.com/api/fare_count/${o}`,n)).data&&u.fire("已刪除！","您的費用調整記錄已被刪除。","success")}catch(s){console.error("刪除錯誤:",s),u.fire("錯誤","刪除過程中發生錯誤","error")}}this.getFareData()},async countFareData(){const{value:o}=await u.fire({title:"下月需付搭乘費計算",text:"請提供下月乘客需實付金額進行扣款計算",input:"number",inputPlaceholder:"輸入您的金額",inputAttributes:{min:1},showCancelButton:!0,confirmButtonText:"確認",cancelButtonText:"取消"});if(o){let e="";this.formattedFareData.forEach(l=>{let n=parseInt(o);l.fareCount.length>0&&l.fareCount.forEach(s=>{n+=s.userFareCount}),e+=`乘客:${l.name}，下月需付:NT$ ${n}<br>`}),u.fire("乘客下月應付額試算",e,"warning")}else u.fire("錯誤","請輸入有效的金額","error")},async addAmount(){if(parseInt(this.amount)===NaN||this.amount===null){u.fire("錯誤","請輸入正數或負數金額","error");return}const{token:o}=this.$store.state,e={headers:{Authorization:`Bearer ${o}`}},l=this.passengerFareData.passengersResult.map(f=>`<option value="${f.line_user_id}">${f.line_user_name}</option>`).join(""),n=()=>{const f=new Date,b=new Date(f.getFullYear(),f.getMonth()-1,1),p=new Date(f.getFullYear(),f.getMonth(),0);return{minDate:b.toISOString().split("T")[0],maxDate:p.toISOString().split("T")[0]}},{minDate:s,maxDate:d}=n(),g={title:"新增搭乘費用紀錄",html:`
          <select id="swal-input1" class="swal2-input">${l}</select>
          <input id="swal-input2" class="swal2-input" placeholder="備註">
          ${this.filteredType==="上月車費"?`<input id="swal-input3" type="date" class="swal2-input" min="${s}" max="${d}">`:""}
        `,focusConfirm:!1,preConfirm:()=>{const f=document.getElementById("swal-input1"),b=f.value,p=f.options[f.selectedIndex].text,a=document.getElementById("swal-input2").value,_=this.filteredType==="上月車費"?document.getElementById("swal-input3").value:null,h=this.amount;if(!b||!a){this.filteredType==="上月車費"&&!_&&u.showValidationMessage("日期為必要項目不能為空"),u.showValidationMessage("皆為必要項目不能為空");return}return{userId:b,userName:p,userRemark:a,selectedDate:_,fareAmount:h}}},m=await u.fire(g);if(m.isConfirmed){const{userId:f,userName:b,userRemark:p,selectedDate:a,fareAmount:_}=m.value;u.fire({title:"確認信息",html:`確認將此用戶新增一筆搭乘紀錄?<br>乘客: ${b}<br>ID前五碼: ${f.slice(0,5)}<br>備註: ${p}<br>金額: NT${_}`,showCancelButton:!0,confirmButtonText:"確定",cancelButtonText:"取消"}).then(async h=>{if(h.isConfirmed){let x=this.$moment().format("YYYY-MM-DD HH:mm:ss");this.filteredType==="上月車費"&&(x=a);const F={userId:f,userRemark:p,fareAmount:_,date:x};try{this.isLoading=!0;const T=await this.$http.post("https://todolist-sql.onrender.com/api/fare/add_fare_count",F,e);u.fire("成功",T.data.message,"success"),this.getFareData(),this.filteredType}catch(T){u.fire("錯誤",T.response.data.message||"無法新增紀錄","error"),console.error("Error:",T)}this.isLoading=!1,this.amount=null}})}},async getDriverData(o){const{token:e}=this.$store.state,l={headers:{Authorization:`Bearer ${e}`},params:{month:"current"}};try{const n=await this.$http.get("https://todolist-sql.onrender.com/api/driver_dates",l),{drive:s,notDrive:d}=n.data;n.data&&(this.driveData=s,this.notDriveData=d,await this.formatDriveData())}catch(n){console.error("Error:",n)}},formatDriveData(){this.formattedDriveData=[],!this.driveData||this.driveData.length===0?this.formattedDriveData.push({id:null,start_date:null,end_date:null,note:"",pass_limit:null}):this.driveData.forEach(o=>{const e=this.formatDate(o.start_date),l=this.formatDate(o.end_date);this.formattedDriveData.push({id:o.id,start_date:e,end_date:l,note:o.note,pass_limit:o.pass_limit})}),this.formatNotDriveData()},formatNotDriveData(){Array.isArray(this.notDriveData)&&this.notDriveData.forEach(o=>{const e=this.formatDate(o.start_date),l=this.formatDate(o.end_date);e===l?this.formattedDriveData.push({id:o.id,start_date:e,end_date:null,note:o.note}):this.formattedDriveData.push({id:o.id,start_date:e,end_date:l,note:o.note})})},formatDate(o){const e=new Date(o),l=e.getFullYear(),n=(e.getMonth()+1).toString().padStart(2,"0"),s=e.getDate().toString().padStart(2,"0");return`${l}-${n}-${s}`},async delTakeRide(o){if((await u.fire({title:"確認刪除",text:"您確定要刪除這條登記時間記錄嗎？",icon:"warning",showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#808080",confirmButtonText:"刪除",cancelButtonText:"取消"})).isConfirmed){const{token:l}=this.$store.state,n={headers:{Authorization:`Bearer ${l}`}};try{(await this.$http.delete(`https://todolist-sql.onrender.com/api/driver_dates/${o}`,n)).data&&(u.fire("已刪除！","您的登記時間記錄已被刪除。","success"),this.getDriverData())}catch(s){console.error("刪除錯誤:",s),u.fire("錯誤","刪除過程中發生錯誤","error")}}},async getPassengerData(o){const{token:e}=this.$store.state,l={headers:{Authorization:`Bearer ${e}`},params:{month:"current"}};try{const n=await this.$http.get("https://todolist-sql.onrender.com/api/driver_passenger_dates",l);n.data&&n.data.passengerData&&(this.formattedPassengerData=n.data.passengerData.map(s=>{const d=g=>g?g.map(m=>m.start_date===m.end_date?{...m,start_date:this.$moment(m.start_date).format("YYYY-MM-DD")}:{...m,start_date:this.$moment(m.start_date).format("YYYY-MM-DD"),end_date:this.$moment(m.end_date).format("YYYY-MM-DD")}):null;return{...s,takeRide:d(s.takeRide),notTakeRide:d(s.notTakeRide)}}))}catch(n){console.error("Error:",n)}},async reserveDate(){if(this.$moment(this.startDate).format("YYYY-MM-DD")>=this.$moment(this.endDate).format("YYYY-MM-DD")||this.$moment(this.startDate).format("YYYY-MM")!==this.$moment(this.endDate).format("YYYY-MM")){u.fire("錯誤","區間規則:不允許同日、後區間小於前區間、區間需當月","warning");return}let o="",e=null;if(this.reverseType){const n=await u.fire({title:"輸入乘客數量限制",input:"number",inputPlaceholder:"請輸入數量",inputAttributes:{min:1},showCancelButton:!0,confirmButtonText:"確定",cancelButtonText:"取消"});if(n.isConfirmed)e=n.value;else return}if(this.isRange){const n=this.$moment(this.startDate).format("YYYY/MM/DD"),s=this.$moment(this.endDate).format("YYYY/MM/DD");o=`您選擇的區間是：<br>${n} 至 ${s}<br>${e?`乘客數量為${e}`:""}<br>確認預約嗎？`}else o=`您選擇的日期是：${this.$moment(this.selectedDate).format("YYYY/MM/DD")}。確認預約嗎？`;if((await u.fire({title:"確認預約",html:o,icon:"question",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"確定",cancelButtonText:"取消"})).isConfirmed){const n=await u.fire({title:"補充備註",input:"text",inputPlaceholder:"如果需要，請在這裡輸入備註...",showCancelButton:!0,confirmButtonText:"確定",cancelButtonText:"不用"});if(n.isConfirmed){const{token:s}=this.$store.state;let d=n.value?n.value:null;const g={headers:{Authorization:`Bearer ${s}`}},m=this.$moment(this.isRange?this.startDate:this.selectedDate).format("YYYY-MM-DD"),f=this.isRange?this.$moment(this.endDate).format("YYYY-MM-DD"):m,b={start_date:m,end_date:f,reverse_type:this.reverseType?1:0,note:d||null,pass_limit:parseInt(e)};try{(await this.$http.post("https://todolist-sql.onrender.com/api/driver_reserve",b,g)).data&&(u.fire("預約成功！","您的預約已成功提交。","success"),await this.getDriverData())}catch(p){console.error("預約錯誤:",p),u.fire("錯誤","預約過程中發生錯誤","error")}}}},handleChangeCategory(o){this.filteredType=o},isCurrentMonth(o){const e=this.$moment().format("YYYY-MM");return o.startsWith(e)},signOut(){this.$store.dispatch("clearAuthData"),localStorage.removeItem("token");const o="https://todolist-sql.onrender.com/api/users/sign_out";this.$http.post(o).then(e=>{u.fire({title:"登出成功",text:e.data.message,icon:"success",confirmButtonText:"了解"})}).catch(e=>{u.fire({title:"登出失敗",text:e.response.data.message,icon:"error",confirmButtonText:"了解"})}),this.$router.push("/"),this.isLoading=!1}},watch:{filteredType(o){o&&(this.filteredType==="當月車費"&&(this.formattedFareData=this.passengerFareData.currentMonthFares),this.filteredType==="上月車費"&&(this.formattedFareData=this.passengerFareData.previousMonthFares),this.calculateTotalFareCount())}},computed:{...$({userInfo:"getUserInfo"}),disabledDates(){return o=>{const e=this.$moment().startOf("month"),l=this.$moment().endOf("month"),n=this.$moment(o);return!(n.isSameOrAfter(e)&&n.isSameOrBefore(l))}}},mounted(){this.getFareData(),this.getDriverData(),this.getPassengerData()}},L={class:"todo-bg pt-1"},V=t("div",{class:"loadingio-spinner-bean-eater-iylmkqp50l"},[t("div",{class:"ldio-t0eby9sr4hr"},[t("div",null,[t("div"),t("div"),t("div")]),t("div",null,[t("div"),t("div"),t("div")])])],-1),j={class:"d-none d-md-block"},U={class:"m-4 d-flex justify-content-between"},z={class:"fw-bold h2 ps-3"},H=t("img",{src:R,alt:"checkbox",style:{height:"55px"}},null,-1),G={class:"d-flex align-items-center"},W={class:"h3 pe-3"},J={class:"m-3 d-flex justify-content-between d-md-none"},K={class:"f-Baloo fw-bold pt-2 h5"},Q=t("img",{src:O,alt:"checkbox"},null,-1),X={class:"d-flex align-items-center"},Z={class:"container pb-5"},tt={key:0,class:"input-group mb-3"},et=t("span",{class:"input-group-text fs-4"},"$",-1),st={class:"input-group-text px-1 py-1 bg-white border-0",for:"todo"},at=t("i",{class:"bi bi-plus-square-fill fs-5"},null,-1),ot=[at],nt={key:1,class:"row row-cols-1 d-flex justify-content-center my-5"},rt=t("h3",{class:"col text-center"},"目前尚無待辦資料",-1),it=t("img",{class:"img-fluid col-4",src:P,alt:""},null,-1),lt=[rt,it],dt={class:"card"},ct={class:"card-header bg-transparent text-center"},ut={class:"nav row mt-2"},ht=["onClick"],mt={key:0,class:"card-body"},ft=t("h5",{class:"d-inline mb-3 me-3"},"開車選項:",-1),_t={class:"form-check form-check-inline mb-3"},pt=t("label",{class:"form-check-label",for:"inlineRadio3"},"開車",-1),Dt={class:"form-check form-check-inline mb-3"},bt=t("label",{class:"form-check-label",for:"inlineRadio4"},"不開車",-1),gt=t("h5",{class:"d-inline mb-3 me-3"},"日期範圍:",-1),yt={class:"form-check form-check-inline mb-3"},vt=t("label",{class:"form-check-label",for:"inlineRadio2"},"單日",-1),kt={class:"form-check form-check-inline mb-3"},Yt=t("label",{class:"form-check-label",for:"inlineRadio1"},"日期區間",-1),xt={key:0},Tt=t("h5",{class:"mb-3"},"選擇單日",-1),Mt={key:1},wt=t("h5",{class:"mb-3"},"選擇搭乘區間",-1),Ft={class:"d-flex"},Ct=t("div",{class:"px-3"},"～",-1),Rt={class:"bg-transparent d-flex justify-content-end mt-3"},Bt={class:"mt-4 ms-1 mb-0"},$t={class:"badge bg-primary p-2"},It={key:2},St={key:0,class:"list-group-item text-start border-bottom"},At={class:"mb-3"},Et={key:0,class:"text-end d-block mb-3"},Nt={class:"d-flex justify-content-end m-0 p-0"},Ot=["onClick"],Pt=t("i",{class:"bi bi-x-square-fill fs-4",style:{color:"#ff0000"}},null,-1),qt=[Pt],Lt={class:"form-check-label d-block mb-2"},Vt={key:0},jt={key:1},Ut={class:"text-end d-block"},zt={key:0},Ht={key:1},Gt={key:3,class:"list-group border-top my-4 border-3 border-secondary list-group-flush"},Wt=t("ul",{class:"list-group border-top my-4 border-3 border-secondary list-group-flush"},null,-1),Jt={class:"mb-3"},Kt={class:"badge bg-success p-2"},Qt={class:"my-2"},Xt={class:"badge bg-secondary p-2"},Zt={key:0},te=t("h5",null,"搭乘日＞",-1),ee={class:"list-group list-group-flush"},se={class:"text-end"},ae={key:1,class:"mt-3"},oe=t("h5",null,"搭乘日＞尚無資訊",-1),ne=[oe],re={key:2,class:"my-2"},ie=t("h5",null,"不搭乘日＞",-1),le={class:"list-group list-group-flush"},de={class:"text-end"},ce={key:3,class:"mt-3"},ue=t("h5",null,"不搭乘日＞尚無資訊",-1),he=[ue],me=t("ul",{class:"list-group border-top my-4 border-3 border-secondary list-group-flush"},null,-1),fe={key:1,class:"card-body"},_e={class:"list-group-item text-start border-bottom border-danger"},pe={class:"py-2"},De={class:"form-check-label d-block text-primary"},be={class:"form-check-label d-block ps-4 py-2"},ge={key:0,class:"text-end d-block"},ye={class:"d-flex justify-content-between align-items-center"},ve=t("label",null,"費用紀錄＞",-1),ke=["onClick"],Ye=t("i",{class:"bi bi-x-square-fill fs-4",style:{color:"#ff0000"}},null,-1),xe=[Ye],Te={class:"form-check-label d-block ps-4 py-2"},Me={key:0,class:"text-end d-block"},we={class:"list-group border-top border-3 border-secondary list-group-flush"},Fe={class:"list-group-item fs-5 d-flex justify-content-between mt-2"},Ce={class:"form-check-label ms-auto mt-2"},Re={key:2,class:"card-footer bg-transparent d-flex justify-content-between pt-3"},Be={key:0,class:"pt-3"},$e={class:"fs-5"};function Ie(o,e,l,n,s,d){var f,b,p;const g=C("loading"),m=C("DatePicker");return r(),i("div",L,[M(g,{active:s.isLoading},{default:I(()=>[V]),_:1},8,["active"]),t("div",j,[t("header",U,[t("h1",z,[H,y(" "+c((((f=o.userInfo)==null?void 0:f.userName)??"")+" 共乘服務"),1)]),t("div",G,[t("h2",W,c(((b=o.userInfo)==null?void 0:b.userName)??""),1),t("button",{class:"btn btn-lg btn-h",onClick:e[0]||(e[0]=(...a)=>d.signOut&&d.signOut(...a))},"登出")])])]),t("header",J,[t("h1",K,[Q,y(" "+c((((p=o.userInfo)==null?void 0:p.userName)??"")+" 共乘服務"),1)]),t("div",X,[t("button",{class:"btn btn-sm btn-h",onClick:e[1]||(e[1]=(...a)=>d.signOut&&d.signOut(...a))},"登出")])]),t("main",Z,[s.filteredType==="當月車費"||s.filteredType==="上月車費"?(r(),i("div",tt,[et,Y(t("input",{"onUpdate:modelValue":e[2]||(e[2]=a=>s.amount=a),type:"number",class:"form-control border-0 py-2",placeholder:"輸入扣除金額",id:"numberInput"},null,512),[[S,s.amount,void 0,{number:!0}]]),t("label",st,[t("button",{class:"btn btn-sm",onClick:e[3]||(e[3]=(...a)=>d.addAmount&&d.addAmount(...a)),type:"button",id:"button-addon2"},ot)])])):D("",!0),o.userInfo.userName?D("",!0):(r(),i("div",nt,lt)),t("div",dt,[t("div",ct,[t("nav",ut,[(r(!0),i(v,null,k(s.category,(a,_)=>(r(),i("a",{class:A(["text-sm-center text-decoration-none col-4 py-2",{tab:s.filteredType===a}]),key:"category"+_,"aria-current":"page",href:"#",onClick:E(h=>d.handleChangeCategory(a),["prevent"])},c(a),11,ht))),128))])]),s.filteredType==="開車登記"?(r(),i("div",mt,[t("div",null,[ft,t("div",_t,[Y(t("input",{"onUpdate:modelValue":e[4]||(e[4]=a=>s.reverseType=a),class:"form-check-input",type:"radio",name:"inlineRadioOptions2",id:"inlineRadio3",value:"true"},null,512),[[w,s.reverseType]]),pt]),t("div",Dt,[Y(t("input",{"onUpdate:modelValue":e[5]||(e[5]=a=>s.reverseType=a),class:"form-check-input",type:"radio",name:"inlineRadioOptions2",id:"inlineRadio4",value:!1},null,512),[[w,s.reverseType]]),bt])]),t("div",null,[gt,t("div",yt,[Y(t("input",{"onUpdate:modelValue":e[6]||(e[6]=a=>s.isRange=a),class:"form-check-input",type:"radio",name:"inlineRadioOptions",id:"inlineRadio2",value:!1},null,512),[[w,s.isRange]]),vt]),t("div",kt,[Y(t("input",{"onUpdate:modelValue":e[7]||(e[7]=a=>s.isRange=a),class:"form-check-input",type:"radio",name:"inlineRadioOptions",id:"inlineRadio1",value:"true"},null,512),[[w,s.isRange]]),Yt])]),s.isRange?(r(),i("div",Mt,[wt,t("div",Ft,[M(m,{name:"startDate",type:"day",format:"YYYY/MM/DD",value:s.startDate,"onUpdate:value":e[9]||(e[9]=a=>s.startDate=a),"disabled-date":d.disabledDates},null,8,["value","disabled-date"]),Ct,M(m,{name:"endDate",type:"day",format:"YYYY/MM/DD",value:s.endDate,"onUpdate:value":e[10]||(e[10]=a=>s.endDate=a),"disabled-date":d.disabledDates},null,8,["value","disabled-date"])])])):(r(),i("div",xt,[Tt,M(m,{name:"singleDate",type:"day",format:"YYYY/MM/DD",value:s.selectedDate,"onUpdate:value":e[8]||(e[8]=a=>s.selectedDate=a),"disabled-date":d.disabledDates},null,8,["value","disabled-date"])])),t("div",Rt,[t("button",{type:"button",class:"btn btn-info border-0 btn-h p-2 px-3",onClick:e[11]||(e[11]=(...a)=>d.reserveDate&&d.reserveDate(...a))},"登記")]),t("h3",Bt,[t("span",$t,c(s.driveData===null&&s.notDriveData===null?"司機尚無開放預約":"司機表"),1)]),s.driveData!==null||s.notDriveData!==null?(r(),i("div",It,[(r(!0),i(v,null,k(s.formattedDriveData,(a,_)=>(r(),i("ul",{class:"list-group list-group-flush",key:a.id},[a.id!==null?(r(),i("li",St,[t("div",At,[a.pass_limit?(r(),i("label",Et,[t("h5",null,c(a.pass_limit?`乘客限:${a.pass_limit}位`:""),1)])):D("",!0),t("div",Nt,[t("button",{class:"btn btn",onClick:h=>d.delTakeRide(a.id),type:"button",id:"button-addon2"},qt,8,Ot)]),t("label",Lt,[_===0&&a.pass_limit!==null?(r(),i("h5",Vt,"*本月開車日＞ ")):(r(),i("h5",jt,"不開車日＞ ")),y(" 備註:"+c(a.note??"無備註"),1)]),t("label",Ut,[_===0?(r(),i("span",zt,"開車")):(r(),i("span",Ht,"不開車")),y("日期:"+c(a.start_date)+" "+c(a.end_date?`～ ${a.end_date}`:""),1)])])])):D("",!0)]))),128))])):D("",!0),s.takeRideData?D("",!0):(r(),i("ul",Gt)),Wt,t("div",null,[t("h3",Jt,[t("span",Kt,c(s.formattedPassengerData.length>0?"乘客搭乘表":"尚無預約"),1)]),(r(!0),i(v,null,k(s.formattedPassengerData,(a,_)=>(r(),i("div",{key:_},[t("h5",Qt,[t("span",Xt,"乘客: "+c(a.name),1)]),a.takeRide&&a.takeRide.length>0?(r(),i("div",Zt,[te,t("ul",ee,[(r(!0),i(v,null,k(a.takeRide,h=>(r(),i("li",{class:"list-group-item text-start border-bottom",key:h.id},[y(" 備註: "+c(h.note??"無備註")+" ",1),t("div",se," 日期: "+c(h.start_date)+" ~ "+c(h.end_date),1)]))),128))])])):(r(),i("div",ae,ne)),a.notTakeRide&&a.notTakeRide.length>0?(r(),i("div",re,[ie,t("ul",le,[(r(!0),i(v,null,k(a.notTakeRide,h=>(r(),i("li",{class:"list-group-item text-start border-bottom",key:h.id},[y(" 備註: "+c(h.note??"無備註")+" ",1),t("div",de," 日期: "+c(h.start_date)+" ~ "+c(h.end_date),1)]))),128))])])):(r(),i("div",ce,he)),me]))),128))])])):D("",!0),s.filteredType!=="搭乘登記"&&s.filteredType!=="開車登記"?(r(),i("div",fe,[(r(!0),i(v,null,k(s.formattedFareData,(a,_)=>(r(),i("ul",{class:"list-group list-group-flush",key:a.id},[t("li",_e,[t("div",pe,[t("label",De,c(s.filteredType==="當月車費"?"本月匯款＞ ":"上月匯款＞ "),1),t("label",be,"乘客:"+c(a.name)+" 費用:"+c(a.fare),1),a.date!=="Invalid date"?(r(),i("label",ge," 紀錄日期:"+c(a.date),1)):D("",!0),(r(!0),i(v,null,k(a.fareCount,(h,x)=>(r(),i("div",{class:"py-2",key:x},[t("div",ye,[ve,t("button",{class:"btn btn",onClick:F=>d.delFareLog(h.id),type:"button",id:"button-addon2"},xe,8,ke)]),t("label",Te," NT$"+c(h.userFareCount)+"，原因: "+c(h.userRemark),1),h.date?(r(),i("label",Me," 紀錄日期:"+c(this.$moment(h.date).format("YYYY-MM-DD")),1)):D("",!0)]))),128))])])]))),128)),t("ul",we,[t("li",Fe,[t("label",Ce,c(s.fareCountTotal),1)])])])):D("",!0),s.filteredType!=="搭乘登記"&&s.filteredType!=="開車登記"?(r(),i("div",Re,[s.formattedFareData?(r(),i("p",Be,[t("span",$e,c(s.formattedFareData.length),1),y(" 則乘客車費紀錄")])):D("",!0),t("button",{type:"button",class:"btn btn-info my-2 border-0 btn-h",onClick:e[12]||(e[12]=(...a)=>d.countFareData&&d.countFareData(...a))},"當前紀錄計算")])):D("",!0)])])])}const Ne=B(q,[["render",Ie]]);export{Ne as default};
