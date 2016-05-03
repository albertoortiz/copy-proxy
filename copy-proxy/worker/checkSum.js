/**
 * Created by albert on 29/2/16.
 */

var crypto = require('crypto');
var fs = require('fs');

module.exports = {

    shasum: function(filePath) {
        fs.readFile(filePath, function (err, data) {
            var calShasum = checksum(data, 'sha1');
            console.log(calShasum);
            return calShasum;
        });
    }
};


function checksum (str, algorithm, encoding) {
    return crypto
        .createHash(algorithm || 'md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex');
}

