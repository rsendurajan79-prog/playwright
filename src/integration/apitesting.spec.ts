import { test, expect } from '@playwright/test';
import jsonPayLoad from '../fixtures/JsonPayload.json' with {type: 'json'};

test('API CRUD Flow', async ({ request }) => {

  //1. CREATE (POST)  base uel and header are passed from the  playwright .config.ts 
  console.log("JOSN Payload for creating user:", jsonPayLoad);
  const newUser = await request.post(`/post`, {

    data: JSON.stringify(jsonPayLoad)

  });
  console.log("Full URL hit:", newUser.url());
  expect(newUser.status()).toBe(201);
  const body = await newUser.json();
  const userId = body.id;
  console.log(`Created user with ID: ${userId}`);


  // 2. READ (GET)
  const getUser = await request.get(`/api/users`, {

    params: {
      'page': `${userId}`,
      'delay': 3
    }
  });
  console.log("Full URL hit:", getUser.url());
  expect(getUser.status()).toBe(200);
  const getBody = await getUser.json();
  console.log("newly add user details:");

  expect(getUser.ok()).toBeTruthy();

  // 3. UPDATE (PUT)
  const update = await request.put(`/api/users/${userId}`, {
    data: {
      "first_name": "Ravi",
      "last_name": "sankar",
      "email": "ravi.sankar@reqres.in",
      "avatar": "https://reqres.in/img/faces/2-image.jpg"
    }
  });
  expect(update.status()).toBe(200);

  // 2. READ (GET)
  const getUser1 = await request.get(`/api/users`, {
    headers: {
      'Content-Type': 'application/json',
      "x-api-key": "reqres_800fda223fd941b4bb1bbc6a810c210b"
    },
    params: {
      'page': `${userId}`,
      'delay': 1
    }
  });
  console.log("Full URL hit:", getUser1.url());
  expect(getUser1.status()).toBe(200);
  const getBody1 = await getUser1.json();
  console.log("Updated add user details:");

  expect(getUser1.ok()).toBeTruthy();

  // 4. DELETE (DELETE)
  const res = await request.delete(`/api/users/${userId}`);
  expect(res.status()).toBe(204);
  console.log(`Deleted user with ID: ${userId}`);

  // 5. VERIFY DELETION (GET)
  const verifyDelete = await request.get(`/api/users/${userId}`);
  expect(verifyDelete.status()).toBe(404);
  console.log(`Verified deletion of user with ID: ${userId}`);


});
test('API Negative Testing', async ({ request }) => {
  // Attempt to create a user with missing required fields
  const response = await request.post(`/api/users`, {
    data: {
      "first_name": "Test"
      // Missing last_name, email, avatar fields
    }
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  console.log("Response for missing fields:", body);
  // Attempt to update a non-existent user
  const updateResponse = await request.put(`/api/users/9999`, {
    data: {
      "first_name": "NonExistent",
      "last_name": "User",
      "email": "nonexistent@example.com"
    }
  });
  expect(updateResponse.status()).toBe(404);
  const updateBody = await updateResponse.json();
  console.log("Response for updating non-existent user:", updateBody);
  // Attempt to delete a non-existent user
  const deleteResponse = await request.delete(`/api/users/9999`);
  expect(deleteResponse.status()).toBe(404);
  console.log("Response for deleting non-existent user:", await deleteResponse.text());
});

test("Api mocking test", async ({ page }) => {
  //Ref : https://www.youtube.com/watch?v=8NoKmao_CRE&t=609s


  // Mock the GET /api/users endpoint to return a custom response
  await page.route('/api/users', async route => {
    const mockedResponse = {
      "page": 1,
      "per_page": 6,

      "total": 12,
      "total_pages": 2,
      "data": [
        {
          "id": 1,
          "email": "sam@gmail.com",
          "first_name": "Mocked",
          "last_name": "User",
          "avatar": "https://reqres.in/img/faces/1-image.jpg"
        }
      ]
    };
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockedResponse)
    });
  }
  );
  // Make a request to the mocked endpoint
  const response = await page.request.get(`/api/users`, {
    params: {
      'page': 1,
      'delay': 1
    }
  });
  console.log("Full URL hit:", response.url());
  expect(response.status()).toBe(200);
  const body = await response.json();
  console.log("Mocked API Response:", body);
  expect(body.data[0].first_name).toBe("Mocked");

  //Mock the Error sceanrio like 500 Internal Server Error and 400 Bad Request
  await page.route('/api/users', async route => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: "Internal Server Error" })
    });
  });
  const errorResponse = await page.request.get(`/api/users`);
  expect(errorResponse.status()).toBe(500);
  const errorBody = await errorResponse.json();
  console.log("Mocked Error Response:", errorBody);
  expect(errorBody.error).toBe("Internal Server Error");

});

// Intercept, modify, and continue original request

test('intercept, modify, and continue', async ({ page }) => {
  // 1. Set up the interceptor BEFORE the action happens
  await page.route('**/objects', async (route) => {
    // Fetch the original request
    const request = route.request();

    // 2. Define your new headers and body
    const modifiedHeaders = {
      ...request.headers(),
      'x-custom-header': 'intercepted-by-playwright',
      'Authorization': 'Bearer custom_token_123'
    };

    const modifiedPayload = {
      title: "Modified Title",
      body: "This body was changed during interception",
      userId: 99
    };

    // 3. Continue the request with the new data
    await route.continue({ // calling original request with modified data
      headers: modifiedHeaders,
      postData: JSON.stringify(modifiedPayload)
    });
  });

  // 4. Trigger the call (e.g., clicking a button or running a fetch)
  await page.goto('https://jsonplaceholder.typicode.com/guide/');

  const response = await page.evaluate(async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({ title: 'Original', body: 'Original', userId: 1 }),
      headers: { 'Content-type': 'application/json' }
    });
    return res.json();
  });

  // Verification: The server response should reflect the MODIFIED data
  console.log('Final Response:', response);
  expect(response.title).toBe("Modified Title");
});

// Intercept, modify, and mocked  original request
test('mock an API response', async ({ page }) => {
  // 1. Intercept the GET request to posts/1
  await page.route('**/posts/1', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 1,
        title: "I am a Mocked Title",
        body: "The real server was never called!",
        userId: 1
      }),
    });
  });

  // 2. Trigger the call
  await page.goto('https://jsonplaceholder.typicode.com/guide/');

  const response = await page.evaluate(async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    return res.json();
  });

  // Verification
  console.log(response.title); // Output: "I am a Mocked Title"
  expect(response.title).toBe("I am a Mocked Title");
});

test('verify API response matches UI value', async ({ page }) => {
  // 1. Setup the listener for the specific background call
  // We use a Promise to capture the response while the page loads
  const responsePromise = page.waitForResponse(response =>
    response.url().includes('/posts/1') && response.status() === 200
  );

  // 2. Trigger the network activity (e.g., navigating or clicking)
  await page.goto('https://jsonplaceholder.typicode.com/guide/');

  // 3. Wait for the API call to resolve and get the JSON data
  const response = await responsePromise;
  const apiData = await response.json();
  const apiTitle = apiData.title; // e.g., "sunt aut facere..."

  // 4. Locate the element in the UI
  // (In this example, we'll look for the text in the first <code> block)
  const uiElement = page.locator('pre').first();
  const uiText = await uiElement.innerText();

  // 5. Assert that the API "truth" matches the UI "display"
  // Note: We check if the UI contains the title from the API
  expect(uiText).toContain(apiTitle);

  console.log(`Verified: API Title "${apiTitle}" matches UI content.`);
});

//verify slow response behaviour of third party APi 
//src\fixtures\latency.fixture.ts

//different Params like Query , path and form parametrs
test('verify API response with different parameters', async ({ page }) => {
  //form parameter
  const response = await page.request.post('https://jsonplaceholder.typicode.com/posts', {
    form: {
      title: 'My Form Post',
      body: 'Testing form data',
      userId: 1
    }
  });
  //qury parameter
  // This sends: GET https://jsonplaceholder.typicode.com/posts?userId=1&_limit=5
  const response1 = await page.request.get('https://jsonplaceholder.typicode.com/posts', {
    params: {
      userId: 1,
      _limit: 5
    }
  });
  //path parameter
  // This sends: GET https://jsonplaceholder.typicode.com/posts/1
  const response2 = await page.request.get('https://jsonplaceholder.typicode.com/posts/1');

});

test('intercept mocking for CRUD', async ({ page }) => {
  //intercept the request and mock the response with different values
  await page.route('**/objects/*', async (route) => {
    const method = route.request().method();
    const userRequestData = route.request().postData();
    console.log("HTTP Method of the intercepted request:", method);
    console.log("user send this response to intercepted :", userRequestData);
    switch (method) {
      case 'GET':
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            "id": "19",
            "name": "GET Mocked Name",
            "data": {
              "Color": "MockedRed",
              "Description": "Mocked High-performance wireless noise cancelling headphones"
            }
          }),
        })
        break;
      case 'POST':
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body:JSON.stringify({
           
            "id": "13",
            "name": "POST Mocked Name",
            "data": {
              "color": "Mocked Cloudy White",
              "capacity GB": 1032
            }
          })
        });
        break;
      case 'PUT':
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body:JSON.stringify({
           
            "id": "3",
            "name": "PUT",
            "data": {
              "color": "PUT Cloudy White",
              "capacity GB": 512
            }
          }) 
        })
        break;
      case 'DELETE':
          await route.fulfill({
          status: 200,
          body: JSON.stringify({ message: "Object deleted successfully" })
        });
      default:
        route.continue();  
    }
  })

  //trigger the APi call 
  const res = await page.evaluate(async () => {
    //Get Call
    //const response = await fetch('https://api.restful-api.dev/objects/1'); //fetch default took GET 
    //POST CALL 
    // const response = await fetch('https://api.restful-api.dev/objects/3', {
    //   method: 'POST', //just change PUT for put mocking
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
           
    //         "id": "3",
    //         "name": "Apple iPhone 12 Pro Max",
    //         "data": {
    //           "color": "Cloudy White",
    //           "capacity GB": 512
    //         }
    //       })
    // });
     const response = await fetch('https://api.restful-api.dev/objects/3', {
      method: 'DELETE', 
      
    });
    return response.json();
  });
  console.log("Mocked API Response with different parameters:", res);

  // 4. Assertion to ensure it actually worked
  expect(res.name).toBe("POST Mocked Name");
})

test('intercept & update value for the original', async ({ page }) => {
  //intercept the request and mock the response with different values
  await page.route('**/objects/*', async (route) => {
    const method = route.request().method();
    const userRequestData = route.request().postData();
    console.log("HTTP Method of the intercepted request:", method);
    console.log("user send this response to intercepted :", userRequestData);
    const modifiedBody=JSON.stringify({
            "id": "19",
            "name": "PATCH Mocked Name",
            "data": {
              "Color": "PATCH MockedRed",
              "Description": "PUT Mocked High-performance wireless noise cancelling headphones"
            }
          })
// GET does not have postData to modify and hence we can't response from server : use route.fullfill 

          if(method=='POST'|| method=='PUT' || method=='PATCH')
            await route.continue({ postData: modifiedBody,});
          else
            await route.continue(); 
    
  })

  //trigger the APi call 
  const res = await page.evaluate(async () => {
   // POST or PUT call
   //For POST without IDS https://api.restful-api.dev/objects/
   //For Put & Patch with id https://api.restful-api.dev/objects/ff8081819cd4022c019cf2584faa2eb4
    const response = await fetch('https://api.restful-api.dev/objects/ff8081819cd4022c019cf2584faa2eb4', {
      method: 'PATCH', //just change PUT for put mocking
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
                      
            "name": "Apple iPhone 12 Pro Max",
            "data": {
              "color": "Cloudy White",
              "capacity GB": 512
            }
          })
    });
    //  const response = await fetch('https://api.restful-api.dev/objects/ff8081819cd4022c019cf221bc9f2e62', {
    //   method: 'DELETE', 
      
    //  });
    return response.json();
  });
  console.log("Updated Response :", res);

  // 4. Assertion to ensure it actually worked
  expect(res.name).toBe("POST Mocked Name");
})
test('API CRUD operation working API ',async({page,request})=>{

  await page.setExtraHTTPHeaders({
    'x-api-key': '0d719000-0e5a-4a82-91d3-99b07d4ab50e'
  });
  
   //post
  const POSTresponse=await request.post(`/objects`,{
    data:{
      "name": "Apple iPhone 12 Pro Max",
            "data": {
              "color": "Cloudy White",
              "capacity GB": 512
            }
    }
  })
  const res=await POSTresponse.json();
    const id=res.id
  // GET CALL for the ID just created using post
  const GETresponse=await request.get(`/objects/${id}`);
  console.log("After POST GET Call Response :");
  console.dir( await GETresponse.json(), {colors: true})
  //put call to update the ID 
  const putResponse=await request.put(`/objects/${id}`,{
    data:{
      "id":`${id}`,
      "name": "PUT HIM NAME",
            "data": {
              "color": "PUT HIM NAME",
              "capacity GB": 512
            }
    }
  })
  console.log("PUT Response :"); 
  console.dir(await putResponse.json(), {colors: true})
  // GET CALL for the ID just created using post
  const PUTGETresponse=await request.get(`/objects/${id}}`);
  console.log("After PUT GET CALL : "); 
  console.dir(await PUTGETresponse.json(), {colors: true})
  //delete call 
  const deleteResponse=await request.delete(`/objects/${id}`);
  console.log("delete Response :");
  console.dir(await deleteResponse.json(), {colors: true})
})
