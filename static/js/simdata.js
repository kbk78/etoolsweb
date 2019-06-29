Vue.use(vueClipboards);
Vue.config.devtools = true;
var apptest = new Vue({
	delimiters: ['${', '}'],
	el: "#apptest",
	data: {
		clipboarddata:"clipboard data",
		simdata:['value1'],
		filtersn:[
			{inp:'equip', type:'number', min:0 , max:3},
			{inp:'oa', type:'number', min:0 , max:5},
			{inp:'wallins', type:'number', min:1 , max:3}
		],
		filtersl:[
			{inp:'sch', type:'list', value:['Office'], options:['Office','Hotel','Multifamily','School']},
			{inp:'idf', type:'list', value:['vav.idf'], options:['vav.idf','psz.idf','hp.idf']},
			{inp:'wea', type:'list', value:['USA_IL_CHICAGO-OHARE INTL AP_TMY3.epw'], options:['USA_TX_HOUSTON BUSH INTERCONTINENTAL_TMY3.epw',
									  'USA_AZ_DEER VALLEY PHOENIX_TMY3.epw',
									  'USA_CA_SAN FRANCISCO INTL AP_TMY3.epw',
									  'USA_IL_CHICAGO-OHARE INTL AP_TMY3.epw',
									  'USA_MN_MINNEAPOLIS ST PAUL INTL ARP_TMY3.epw']},
		]},
	methods:{
		faction(){
			fetch('simdataapi').then(dat=>dat.json()).then(function(js){
			this.simdata = js;
			plotch();
			});
	  	},
		plotch(){
			var scf  = crossfilter(this.simdata);
			var euidim = scf.dimension(function(d) { return [d.index , d.EUI];});
			var lgtdim = scf.dimension(function(d) { return [d.index , d.EUI];});
			var euidim = scf.dimension(function(d) { return [d.index , d.EUI];});
			var euidim = scf.dimension(function(d) { return [d.index , d.EUI];});
			var euidim = scf.dimension(function(d) { return [d.index , d.EUI];});




			var euigrp = euidim.group();
			var euigrp = euidim.group();

/*
idf
inp:equip
inp:wallins
inp:oa
inf:sch

wea
InteriorLighting:Electricity
InteriorLighting:ElectricityDemand
InteriorEquipment:Electricity
InteriorEquipment:ElectricityDemand
Cooling:Electricity
Cooling:ElectricityDemand
Fans:Electricity
Fans:ElectricityDemand
Heating:NaturalGas
Heating:NaturalGasDemand
EUI
*/



			var chart = dc.scatterPlot("#ch1");
			chart
			    .width(768)
			    .height(480)
			   // .x(d3.scaleLinear().domain(d3.extent(this.tdbs)))
			    .x(d3.scaleLinear().domain([0,40000]))
			    .brushOn(false)
			    .yAxisLabel("EUI")
			    .xAxisLabel("Index")
			    .dimension(euidim)
			    .group(euigrp)
			chart.render();
		},

		openFile(event){
			console.log('loading')
			let self = this
			var reader = new FileReader();
			reader.onload = function(e){
			var text1 = reader.result.split('\n').slice(-8761).join('\n');
			self.tdbs = d3.csvParseRows(text1,function(d,i){return +d[6]*1.8+32;});
			self.plotch()
			}
			reader.readAsText(event);
			},
	}
  });

var r;

function test(){

	fetch('simdataapi').then(dat=>dat.json()).then(function(s){

		r = s;
		var scf  = crossfilter(s);
		var euidim = scf.dimension(function(d) { return [d.index , d.EUI];});
		var euigrp = euidim.group();

				var chart = dc.scatterPlot("#ch1");
				chart
				    .width(768)
				    .height(480)
				   // .x(d3.scaleLinear().domain(d3.extent(this.tdbs)))
				    .x(d3.scaleLinear().domain([0,40000]))
				    .brushOn(false)
				    .yAxisLabel("EUI")
				    .xAxisLabel("Index")
				    .dimension(euidim)
				    .group(euigrp)
				chart.render();

	});
	console.log(r);


	di = {'a':[1,2,3,4],'b':[41,42,43,44]};
	cs  = crossfilter(di);
	dim = cs.dimension(function(d){return d.a;},true);
	gp = dim.group();

				var chart = dc.scatterPlot("#ch1");
				chart
				    .width(768)
				    .height(480)
				   // .x(d3.scaleLinear().domain(d3.extent(this.tdbs)))
				    .x(d3.scaleLinear().domain([1,5]))
				    .brushOn(false)
				    .yAxisLabel("b")
				    .xAxisLabel("a")
				    .dimension(dim)
				    .group(gp)
				chart.render();


};

//test();
