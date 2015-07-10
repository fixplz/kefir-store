var K = require('kefir')
var Store = require('watchable-store')

module.exports = function KefirStore() {
    var me = Store.apply(null, arguments)
    var innerWatch = me.watch

    me.watch = function (key) {
        if(arguments.length == 2)
            return innerWatch.apply(me, arguments)

        return K.stream(function(emitter) {
            var watcher = function(val) { emitter.emit(val) }
            me.watch(key, watcher)
            emitter.emit(me.get(key))
            return function () { me.unwatch(key, watcher) }
        })
    }

    return me
}
