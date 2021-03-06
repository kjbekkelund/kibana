import 'elasticsearch-browser';
import _ from 'lodash';
import uiModules from 'ui/modules';

var es; // share the client amoungst all apps
uiModules
  .get('kibana', ['elasticsearch', 'kibana/config'])
  .service('es', function (esFactory, esUrl, $q, esApiVersion) {
    if (es) return es;

    es = esFactory({
      host: esUrl,
      log: 'info',
      requestTimeout: 0,
      apiVersion: esApiVersion,
      plugins: [function (Client, config) {

        // esFactory automatically injects the AngularConnector to the config
        // https://github.com/elastic/elasticsearch-js/blob/master/src/lib/connectors/angular.js
        _.class(CustomAngularConnector).inherits(config.connectionClass);
        function CustomAngularConnector(host, config) {
          CustomAngularConnector.Super.call(this, host, config);

          this.request = _.wrap(this.request, function (request, params, cb) {
            if (String(params.method).toUpperCase() === 'GET') {
              params.query = _.defaults({ _: Date.now() }, params.query);
            }

            return request.call(this, params, cb);
          });
        }

        config.connectionClass = CustomAngularConnector;

      }]
    });

    return es;
  });
