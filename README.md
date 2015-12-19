# Deploy to OpsWorks using a Lambda function

## Requirements

* AWS OpsWorks
 * Stack Id
 * App Id
 * Running instances

* AWS Lambda
* AWS Api Gateway

## Lambda function
Create a lambda function that actually connect to OpsWorks and do the deploy

### Permissions
We need to create a new role to allow OpsWorks access. Create it and attach the policy with
the minimun permissions to deploy, see the file `deployOpsworksPolicy.json`

Create a new lambda function, assign the recently created role and use the code in `index.js`
The entry point is `index.handler`

## Api Gateway
Then conect your lambda function with the outside world. Assign a new endpoint to your fuction.

### Configuration
Create a POST endpoint without authentification. The authentification must be manual, due to bitbucket
callback limitations.

### Mapping request
Now, we need to map the HTTP request and transform it to event data for out Lambda. To do this,
go to the endpoint *Integration Request* configuration and in *Mapping templates* create a new
one using *application/json* as content type. Then, modify the template and put this code

```
$input.json('$')
```

This will parse the body raw and create a js object that will be the *event* parameter in the lambda function.

### Deploy the API endpoint
After making the deployment of API endpoint, you will have an url like `https://das76asdj.execute-api.eu-west-1.amazonaws.com/prod`

The final url is that one adding at the end the name of your endpoint, so, for example
`https://das76asdj.execute-api.eu-west-1.amazonaws.com/prod/deployApi`

Note:
Take in account, that calling the API to non existing endpoint, or using bad method, return a "Authentification error"

## Bitbucket
We already have the Lambda function and the API endpoint that we need to call. Now we need to call this endpoint from *Bitbucket* each time that we merge a pull request or we make a push to master

Go to the Bitbucket repository setting, to the Webhooks section and add a new one using the url to the lamda function.
Choose as triggers
* Push
* Pull request merged

Now, every time we merge a pull request or push to master, bitbucket will call our API