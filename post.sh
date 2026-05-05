curl --location 'http://localhost:3000/profiles' \
--header 'Content-Type: application/json' \
--data '{
    "name" : "li",
    "description": "This is a test profile."
}'