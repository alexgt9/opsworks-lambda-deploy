var aws = require('aws-sdk');
var opsWorks = new aws.OpsWorks({ apiVersion: 'latest', region: 'us-east-1' });

exports.handler = function(event, context) {
    var deploy = false;
    var mainBranch = "master";
    if (event && event.pullrequest && event.pullrequest.destination.branch.name == mainBranch) {
      deploy = true;
    }
    if (event &&
        event.push &&
        event.push.changes[0].new.name == mainBranch ||
        /*event.repository.full_name == "vedor/repo-name" Deploy only desired repository*/) {
      deploy = true;
    }
    if (deploy) {
        var params = {
          Command: {
            Name: 'deploy',
          },
          StackId: STRING,
          AppId: STRING,
          Comment: 'Deploying from lambda' /* Custom user comment showed in deployments interface */
        };

        opsWorks.createDeployment(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
                context.fail(err);
            }
            else {
                context.succeed(data);
            }
        });
    }
};