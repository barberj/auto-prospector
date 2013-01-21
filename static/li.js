var app = angular.module('LinkApp', []);
app.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

app.controller('GroupSearch', function GroupSearch($scope, $http) {
    $scope.searches = ['All', 'Group', 'Company', 'Skill'];
    $scope.results = {};
    $scope.search = 'all';

    function Result(){
        this.url=null;
        this.name=null;
        this.id=null;
        this.image=null;
    }

    $scope.query = function(param, results) {
        angular.forEach(results, function(value, key){
            delete results[key];
        });
        results.error = false;
        if(param==undefined){
            return;
        }

        param = encodeURIComponent(param);
        var url = 'http://www.linkedin.com/ta/federator?query='+
          param+'&types=mynetwork,company,group,sitefeature,skill';

        $http.jsonp(url+'&callback=JSON_CALLBACK').success(function(data, status) {
            results['all'] = [];
            angular.forEach(data, function(value, key){
                results[key] = [];
                angular.forEach(value['resultList'], function(v, k){
                  r = new Result();
                  r.url = v.url;
                  r.id = v.id;
                  r.name = v.displayName;
                  r.image = v.imageUrl;
                  r.gurl = 'https://www.google.com/search?q="'+param+'"+site:linkedin.com/in/+OR+site:linkedin.com/pub/+-site:linkedin.com/pub/dir/';
                  results[key].push(r);
                  results['all'].push(r);
                });
            });
        }).error(function(data, status){
            results.error = true;
        });
    };

});
