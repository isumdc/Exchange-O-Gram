define({ "api": [
  {
    "type": "post",
    "url": "/api/post",
    "title": "Create a post",
    "name": "Post",
    "group": "Post",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "image",
            "description": "<p>The image with the post</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "caption",
            "description": "<p>A caption for the post</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "author",
            "description": "<p>The author of the post</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ImageNotFound",
            "description": "<p>No image was uploaded with the post</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadParams",
            "description": "<p>No caption or author was provided.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.js",
    "groupTitle": "Post"
  },
  {
    "type": "get",
    "url": "/api/posts/",
    "title": "Get all posts",
    "name": "GetPosts",
    "group": "Posts",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "posts",
            "description": "<p>A list of posts.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n     {\n         \"id\": \"123456789\",\n          \"caption\": \"Caption for the post\",\n            \"author\": \"Ian McDowell\",\n            \"date\": \"1452794148\",\n            \"url\": \"/uploads/asdfgjkl.jpg\"\n     },\n     ...\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.js",
    "groupTitle": "Posts"
  }
] });
