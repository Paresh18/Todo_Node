
var request = require('supertest');
var app  = require('./app');

var redis =require('redis');
var client =redis.createClient();
client.select('test'.length);
client.flushdb();

describe('Request to the root path',function()
{
	it('Resturns a 200 staus code',function(done){

request(app)
       .get('/')
       .expect(200)
       .end(function(error){
       	if(error) throw error;
       	done();
       });
  });

});

describe('listing cities on /cities',function()
{
  it('Returns 200 status code',function(done){

request(app)
       .get('/cities')
       .expect(200,done)
  });


  it('Returns an index file with Cities',function(done){ 
    request(app)
        .get('/')
        .expect(/cities/i,done);
  });

it('Returns JSON Format',function(done)
{
	request(app)
	       .get('/cities')
	       .expect('Content-Type',/json/)
	       .end(function(error){
	        if(error) throw 'error'
	        done();	
	       });
});


it('Returns intial cities',function(done)
{
	request(app)
	       .get('/cities')
	       .expect(JSON.stringify([]),done);
	       
});


});


describe('Creating new cities',function(){

   it('Returns a 201 status code',function(done){

    request(app)
       .post('/cities')
       .send('name=Springfield&description=where+the+simpsons+live')
       .expect(201,done);
   });

   it('Returns the city name',function(done)
   { 
      request(app)
           .post('/cities')
           .send('name=Springfield&description=where+the+simpsons+live')
           .expect(/springfield/i,done);

   });

   it('Validates city name and description',function(done){

    request(app)
           .post('/cities')
           .send('name=&description=')
           .expect(400,done);
   });


   });




describe('Deleting cities', function(){

  before(function(){
    client.hset('cities', 'Banana', 'a tasty fruit');
  });

  after(function() {
    client.flushdb();
  });


  it('Returns a 204 status code', function(done){

    request(app)
      .delete('/cities/Banana')
      .expect(204)
      .end(function(error){
        if(error) throw 'error'
        done();
      });
  });
});

describe('Shows city info',function(){

before(function(){

client.hset('cities','Banana','a tasty city');
});

after(function(){
client.flushdb();

});

it('Returns 200 status code',function(done){

  request(app)
       .get('/cities/Banana')
       .expect(200,done);
});


it('Returns html form',function(done){

  request(app)
       .get('/cities/Banana')
       .expect('Content-Type',/html/,done);

});

it('Returns information about the banana city',function(done){

});
});