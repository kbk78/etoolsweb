Vue.use(vueClipboards);
var app6 = new Vue({
  el: '#app-6',
  data: {
   bins: 20,
   tdbs: [1],
   items: [
          {key:90 ,value:20 },
      ],
  
  },
  methods:{
      plotch(){
        var tdbscrossfilter = crossfilter(this.tdbs);
        var binwidth = this.bins;
        var tdbsdim = tdbscrossfilter.dimension(function(d) { return d;});
        var tdbsgroup = tdbsdim.group(function(d) { return binwidth * Math.floor(d/binwidth); });
        this.items = tdbsgroup.all()
        var extent = d3.extent(this.tdbs)
        extent[0] = extent[0]-binwidth

        var chart = dc.barChart("#ch1");
        chart
            .width(768)
            .height(480)
            .xUnits(dc.units.fp.precision(binwidth))
           // .x(d3.scaleLinear().domain(d3.extent(this.tdbs)))
            .x(d3.scaleLinear().domain(extent))
            .brushOn(false)
            .yAxisLabel("Temperature bins degF")
            .dimension(tdbsdim)
            .group(tdbsgroup)
//		    .xAxis().ticks(5)
        chart.render();

          
        dc.dataTable("#tdb-table")
            .dimension(tdbsdim)
            .section(function(d){return d})
            .columns(['tdbs'])
            .size(500) 
                   .order(d3.descending)


         },

      openFile (event){
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

      objtoarray(bins){
             return String(Object.keys(bins).map(function(key) {
                return String(bins[key].key)+','+String(bins[key].value)+'\n';
              }));
      }
     }
 }
  )
var apptest = new Vue({
el: "#apptest",
data: {
 message:"text to copy"
}
});

