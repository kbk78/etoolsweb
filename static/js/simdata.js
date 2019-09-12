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
			fetch('simdataapi').then(dat=>dat.json()).then(js => {
			this.simdata = js;
			this.plotbox();
			});
	  	},

		plotch(){
	
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

		plotbox(){
			var scf  = crossfilter(this.simdata);
			var euidim = scf.dimension(d=>[d.index , d.EUI]);
			var euigrp = euidim.group();

			var eqdim = scf.dimension(d=>d.inp_equip);

			eqdim.filter(d=>d>=this.filtersn[0].min);
	//		eqdim.filter(d=>d<=this.filtersn[0].max);

			var oadim = scf.dimension(d=>d.inp_oa);
			var wallinsdim = scf.dimension(d=>d.inp_wallins);

			var schdim = scf.dimension(d=>d.inp_sch);
			var idfdim = scf.dimension(d=>d.idf);
			var weadim = scf.dimension(d=>d.wea);


/*
			var lceldim = scf.dimension(function(d) { return [d.index , d.Cooling_Electricity];});
			var fneldim = scf.dimension(function(d) { return [d.index , d.Fans_Electricity];});
			var htgadim = scf.dimension(function(d) { return [d.index , d.Heating_NaturalGas];});
			var clsndim = scf.dimension(function(d) { return [d.index , d.ClCoilSens];});

			var clltdim = scf.dimension(function(d) { return [d.index , d.ClCoilLat];});
			var htcldim = scf.dimension(function(d) { return [d.index , d.HtCoil];});

*/
	dc.config.defaultColors(d3.schemeSet1);
	euiGroup = weadim.group().reduce(
		function(p,v) {
		  // keep array sorted for efficiency
		  p.splice(d3.bisectLeft(p, v.EUI), 0, v.EUI);
		  return p;
		},
		function(p,v) {
		  p.splice(d3.bisectLeft(p, v.EUI), 1);
		  return p;
		},
		function() {
		  return [];
		}
      );

	 var bp01 = dc.boxPlot("#boxch1");
	    bp01
		    .width(768)
		    .height(480)
		    .margins({top: 10, right: 50, bottom: 30, left: 50})
		    .dimension(weadim)
		    .group(euiGroup)
		    .elasticY(true)
		    .elasticX(true);
	bp01.render()




		},

		plotchdc(){
			var scf  = crossfilter(this.simdata);
			var euidim = scf.dimension(d=>[d.index , d.EUI]);
			var euigrp = euidim.group();

			var eqdim = scf.dimension(d=>d.inp_equip);
			console.log(this.filtersn[0].min)

			eqdim.filter(d=>d>=this.filtersn[0].min);
	//		eqdim.filter(d=>d<=this.filtersn[0].max);

			var oadim = scf.dimension(d=>d.inp_oa);
			var wallinsdim = scf.dimension(d=>d.inp_wallins);

			var schdim = scf.dimension(d=>d.inp_sch);
			var idfdim = scf.dimension(d=>d.idf);
			var weadim = scf.dimension(d=>d.wea);


/*
			var lceldim = scf.dimension(function(d) { return [d.index , d.Cooling_Electricity];});
			var fneldim = scf.dimension(function(d) { return [d.index , d.Fans_Electricity];});
			var htgadim = scf.dimension(function(d) { return [d.index , d.Heating_NaturalGas];});
			var clsndim = scf.dimension(function(d) { return [d.index , d.ClCoilSens];});

			var clltdim = scf.dimension(function(d) { return [d.index , d.ClCoilLat];});
			var htcldim = scf.dimension(function(d) { return [d.index , d.HtCoil];});
*/

			dc.config.defaultColors(d3.schemeSet1);
			var chart = dc.scatterPlot("#ch1");
			chart
			    .width(768)
			    .height(580)
			   // .x(d3.scaleLinear().domain(d3.extent(this.tdbs)))
			    .x(d3.scaleLinear().domain([0,40000]))
			    .brushOn(false)
			    .yAxisLabel("EUI dc")
			    .xAxisLabel("Index")
			    .dimension(euidim)
			    .group(euigrp)
			chart.render();
			dc.redrawAll()
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


var livingThings;

function test(){

livingThings = crossfilter([
  { name: 'Rusty',  type: 'human', legs: 2 },
  { name: 'Alex',   type: 'human', legs: 2 },
  { name: 'Lassie', type: 'dog',   legs: 4 },
  { name: 'Spot',   type: 'dog',   legs: 4 },
  { name: 'Polly',  type: 'bird',  legs: 2 },
  { name: 'Fiona',  type: 'plant', legs: 0 }
]);

var n = livingThings.groupAll().reduceCount().value();
var typeDimension = livingThings.dimension(function(d) { return d.type; });
typeDimension.filter('dog')

};

test();

function sampleboxplot(){

let exp = [
{"Expt":	1	,	"Run":	1	,	"Speed":	850	},
{"Expt":	1	,	"Run":	2	,	"Speed":	740	},
{"Expt":	1	,	"Run":	3	,	"Speed":	900	},
{"Expt":	1	,	"Run":	4	,	"Speed":	1070	},
{"Expt":	1	,	"Run":	5	,	"Speed":	930	},
{"Expt":	1	,	"Run":	6	,	"Speed":	850	},
{"Expt":	1	,	"Run":	7	,	"Speed":	950	},
{"Expt":	1	,	"Run":	8	,	"Speed":	980	},
{"Expt":	1	,	"Run":	9	,	"Speed":	980	},
{"Expt":	1	,	"Run":	10	,	"Speed":	880	},
{"Expt":	1	,	"Run":	11	,	"Speed":	1000	},
{"Expt":	1	,	"Run":	12	,	"Speed":	980	},
{"Expt":	1	,	"Run":	13	,	"Speed":	930	},
{"Expt":	1	,	"Run":	14	,	"Speed":	650	},
{"Expt":	1	,	"Run":	15	,	"Speed":	760	},
{"Expt":	1	,	"Run":	16	,	"Speed":	810	},
{"Expt":	1	,	"Run":	17	,	"Speed":	1000	},
{"Expt":	1	,	"Run":	18	,	"Speed":	1000	},
{"Expt":	1	,	"Run":	19	,	"Speed":	960	},
{"Expt":	1	,	"Run":	20	,	"Speed":	960	},
{"Expt":	2	,	"Run":	1	,	"Speed":	960	},
{"Expt":	2	,	"Run":	2	,	"Speed":	940	},
{"Expt":	2	,	"Run":	3	,	"Speed":	960	},
{"Expt":	2	,	"Run":	4	,	"Speed":	940	},
{"Expt":	2	,	"Run":	5	,	"Speed":	880	},
{"Expt":	2	,	"Run":	6	,	"Speed":	800	},
{"Expt":	2	,	"Run":	7	,	"Speed":	850	},
{"Expt":	2	,	"Run":	8	,	"Speed":	880	},
{"Expt":	2	,	"Run":	9	,	"Speed":	900	},
{"Expt":	2	,	"Run":	10	,	"Speed":	840	},
{"Expt":	2	,	"Run":	11	,	"Speed":	830	},
{"Expt":	2	,	"Run":	12	,	"Speed":	790	},
{"Expt":	2	,	"Run":	13	,	"Speed":	810	},
{"Expt":	2	,	"Run":	14	,	"Speed":	880	},
{"Expt":	2	,	"Run":	15	,	"Speed":	880	},
{"Expt":	2	,	"Run":	16	,	"Speed":	830	},
{"Expt":	2	,	"Run":	17	,	"Speed":	800	},
{"Expt":	2	,	"Run":	18	,	"Speed":	790	},
{"Expt":	2	,	"Run":	19	,	"Speed":	760	},
{"Expt":	2	,	"Run":	20	,	"Speed":	800	},
{"Expt":	3	,	"Run":	1	,	"Speed":	880	},
{"Expt":	3	,	"Run":	2	,	"Speed":	880	},
{"Expt":	3	,	"Run":	3	,	"Speed":	880	},
{"Expt":	3	,	"Run":	4	,	"Speed":	860	},
{"Expt":	3	,	"Run":	5	,	"Speed":	720	},
{"Expt":	3	,	"Run":	6	,	"Speed":	720	},
{"Expt":	3	,	"Run":	7	,	"Speed":	620	},
{"Expt":	3	,	"Run":	8	,	"Speed":	860	},
{"Expt":	3	,	"Run":	9	,	"Speed":	970	},
{"Expt":	3	,	"Run":	10	,	"Speed":	950	},
{"Expt":	3	,	"Run":	11	,	"Speed":	880	},
{"Expt":	3	,	"Run":	12	,	"Speed":	910	},
{"Expt":	3	,	"Run":	13	,	"Speed":	850	},
{"Expt":	3	,	"Run":	14	,	"Speed":	870	},
{"Expt":	3	,	"Run":	15	,	"Speed":	840	},
{"Expt":	3	,	"Run":	16	,	"Speed":	840	},
{"Expt":	3	,	"Run":	17	,	"Speed":	850	},
{"Expt":	3	,	"Run":	18	,	"Speed":	840	},
{"Expt":	3	,	"Run":	19	,	"Speed":	840	},
{"Expt":	3	,	"Run":	20	,	"Speed":	840	},
{"Expt":	4	,	"Run":	1	,	"Speed":	890	},
{"Expt":	4	,	"Run":	2	,	"Speed":	810	},
{"Expt":	4	,	"Run":	3	,	"Speed":	810	},
{"Expt":	4	,	"Run":	4	,	"Speed":	820	},
{"Expt":	4	,	"Run":	5	,	"Speed":	800	},
{"Expt":	4	,	"Run":	6	,	"Speed":	770	},
{"Expt":	4	,	"Run":	7	,	"Speed":	760	},
{"Expt":	4	,	"Run":	8	,	"Speed":	740	},
{"Expt":	4	,	"Run":	9	,	"Speed":	750	},
{"Expt":	4	,	"Run":	10	,	"Speed":	760	},
{"Expt":	4	,	"Run":	11	,	"Speed":	910	},
{"Expt":	4	,	"Run":	12	,	"Speed":	920	},
{"Expt":	4	,	"Run":	13	,	"Speed":	890	},
{"Expt":	4	,	"Run":	14	,	"Speed":	860	},
{"Expt":	4	,	"Run":	15	,	"Speed":	880	},
{"Expt":	4	,	"Run":	16	,	"Speed":	720	},
{"Expt":	4	,	"Run":	17	,	"Speed":	840	},
{"Expt":	4	,	"Run":	18	,	"Speed":	850	},
{"Expt":	4	,	"Run":	19	,	"Speed":	850	},
{"Expt":	4	,	"Run":	20	,	"Speed":	780	},
{"Expt":	5	,	"Run":	1	,	"Speed":	890	},
{"Expt":	5	,	"Run":	2	,	"Speed":	840	},
{"Expt":	5	,	"Run":	3	,	"Speed":	780	},
{"Expt":	5	,	"Run":	4	,	"Speed":	810	},
{"Expt":	5	,	"Run":	5	,	"Speed":	760	},
{"Expt":	5	,	"Run":	6	,	"Speed":	810	},
{"Expt":	5	,	"Run":	7	,	"Speed":	790	},
{"Expt":	5	,	"Run":	8	,	"Speed":	810	},
{"Expt":	5	,	"Run":	9	,	"Speed":	820	},
{"Expt":	5	,	"Run":	10	,	"Speed":	850	},
{"Expt":	5	,	"Run":	11	,	"Speed":	870	},
{"Expt":	5	,	"Run":	12	,	"Speed":	870	},
{"Expt":	5	,	"Run":	13	,	"Speed":	810	},
{"Expt":	5	,	"Run":	14	,	"Speed":	740	},
{"Expt":	5	,	"Run":	15	,	"Speed":	810	},
{"Expt":	5	,	"Run":	16	,	"Speed":	940	},
{"Expt":	5	,	"Run":	17	,	"Speed":	950	},
{"Expt":	5	,	"Run":	18	,	"Speed":	800	},
{"Expt":	5	,	"Run":	19	,	"Speed":	810	},
{"Expt":	5	,	"Run":	20	,	"Speed":	870	}];




 	var ndx                 = crossfilter(exp)
      runDimension        = ndx.dimension(function(d) {return +d.Run;})
      runGroup            = runDimension.group()
      experimentDimension = ndx.dimension(function(d) {return "exp-" + d.Expt;})

      speedArrayGroup     = experimentDimension.group().reduce(
        function(p,v) {
          // keep array sorted for efficiency
          p.splice(d3.bisectLeft(p, v.Speed), 0, v.Speed);
          return p;
        },
        function(p,v) {
          p.splice(d3.bisectLeft(p, v.Speed), 1);
          return p;
        },
        function() {
          return [];
        }
      );


	 dc.config.defaultColors(d3.schemeSet1);
	 var bp01 = dc.boxPlot("#boxch1");
	    bp01
		    .width(768)
		    .height(480)
		    .margins({top: 10, right: 50, bottom: 30, left: 50})
		    .dimension(experimentDimension)
		    .group(speedArrayGroup)
		    .elasticY(true)
		    .elasticX(true);
	bp01.render()
	    


}





/*
			t0=performance.now()
			t1=performance.now()
			console.log(t1-t0)


var chart = dc.scatterPlot("#ch1");

fetch('simdataapi').then(dat=>dat.json()).then(js => {
c = js;
});

var scf  = crossfilter(c);
var euidim = scf.dimension(d=>[d.index , d.EUI]);
var euigrp = euidim.group();

var eqdim = scf.dimension(d=>d.inp_equip);

var oadim = scf.dimension(d=>d.inp_oa);
var wallinsdim = scf.dimension(d=>d.inp_wallins);

var schdim = scf.dimension(d=>d.inp_sch);
var idfdim = scf.dimension(d=>d.idf);
var weadim = scf.dimension(d=>d.wea);

	//		eqdim.filter(d=>d>=10);
	//		eqdim.filter(d=>d<=this.inp[1].max);


chart
    .brushOn(false)
    .x(d3.scaleLinear().domain([0,40000]))
    .dimension(euidim)
    .group(euigrp)
chart.render();



var paymentsRecord = [
	  {date: "2011-11-14T16:17:54Z", quantity: 2, total: 190, tip: 80, type: "tab"},
          {date: "2011-11-14T16:20:19Z", quantity: 2, total: 190, tip: 80, type: "tab"},
          {date: "2011-11-14T16:28:54Z", quantity: 1, total: 300, tip: 50, type: "visa"},
          {date: "2011-11-14T16:30:43Z", quantity: 2, total: 90, tip: 20, type: "tab"},
          {date: "2011-11-14T16:48:46Z", quantity: 2, total: 90, tip: 40, type: "tab"},
          {date: "2011-11-14T16:53:41Z", quantity: 2, total: 90, tip: 60, type: "tab"},
          {date: "2011-11-14T16:54:06Z", quantity: 1, total: 100, tip: 80, type: "cash"},
          {date: "2011-11-14T16:58:03Z", quantity: 2, total: 90, tip: 20, type: "tab"},
          {date: "2011-11-14T17:07:21Z", quantity: 2, total: 90, tip: 60, type: "tab"},
          {date: "2011-11-14T17:22:59Z", quantity: 2, total: 90, tip: 40, type: "tab"},
          {date: "2011-11-14T17:25:45Z", quantity: 2, total: 200, tip: 40, type: "cash"},
          {date: "2011-11-14T17:29:52Z", quantity: 1, total: 200, tip: 80, type: "visa"}
        ];


var facts = crossfilter(paymentsRecord);

var scatterDimension = facts.dimension(d=>[d.total, d.tip]);
var scatterGroup = scatterDimension.group();

var scatter = dc.scatterPlot("#ch1"); 

scatter
          .dimension(scatterDimension)
	  .brushOn(false)
          .group(scatterGroup)
	  .x(d3.scaleLinear().domain([0,350]))
	  .y(d3.scaleLinear().domain([-10,100]))
scatter.render();

var scatterDimension2 = facts.dimension(d=>d.tip);
scatterDimension2.filter(d=>d>80);


--crossfilter commands

 crossfilter.size()
crossfilter.allFiltered() --print all filtered data
crossfilter.onChange(callbackFunction)



*/
