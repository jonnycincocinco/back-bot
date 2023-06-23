curl -X POST -H "Content-Type: application/json" -d '{
  "transactions": [
    {
      "category": ["Food", "Groceries"],
      "amount": 50
    },
    {
      "category": ["Entertainment"],
      "amount": 25
    }
  ]
}' http://localhost:8000/generate-story