//Vue.use(vueClipboards);
Vue.config.devtools = true;

var testapp = new Vue({
  delimiters: ['${', '}'],
  el: '#app',
  data: {
    message: 'Hey There solve this!'
  }
});


var kiduapp = new Vue({
	delimiters: ['${', '}'],
	el: "#kiduapp",
	data: {
		testdat:'test data works',
		num1:8,
		num2:9,
		opr1:'x',
		ans2:'',
		ansmsg:'',
		totq:0,
		rgt:0,
		perright:0,
		sspeed:0,
		sspeed1:0,
		sspeed2:0,
		},
	created(){
		this.sspeed1 = new Date();
	},

	methods:{
		mul1(){
			if (this.ans2 == this.num1*this.num2){
			this.ansmsg= "Correct!";
			this.totq=this.totq+1;
			this.rgt = this.rgt+1;
			this.perright = (this.rgt/this.totq*100).toFixed(2);
			}
			else{
			this.ansmsg ="Incorrect: "+(this.num1).toString() + ' x ' + (this.num2).toString()+'='+ (this.num1*this.num2).toString();
			this.totq=this.totq+1;
			this.perright = (this.rgt/this.totq*100).toFixed(2);
			}

			this.num1 = Math.floor(11+Math.random()*4);
			this.num2 = Math.floor(1+Math.random()*10);
			this.ans2 = ''
			//this.sspeed = new Date();
			//console.log(new Date());
			this.sspeed2 = new Date();
			this.sspeed = ((this.sspeed2.getMinutes()*60+this.sspeed2.getSeconds() - this.sspeed1.getMinutes()*60-this.sspeed1.getSeconds())/this.totq).toFixed(0);
		},

		faction(){
			fetch('simdataapi').then(dat=>dat.json()).then(js => {
				this.simdata = js;
				this.plotbox();
			});
		},

		plotc3(){

			var chart = c3.generate({
				bindto: '#ch1',
				data: {
					json: this.simdata,
					type:'scatter',
					keys: {
						value:['EUI'],
					},	
				}
			});
		},
	}
});

