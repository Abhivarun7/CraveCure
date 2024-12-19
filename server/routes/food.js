const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const data = {
    categories: [
      {
        name: "Popular Foods",
        items: [
          {
            name: "Biryani",
            image: "http://localhost:3001/assets/biryani.PNG"
          },
          {
            name: "Noodles",
            image: "http://localhost:3001/assets/noodles.PNG"
          },
          {
            name: "Burgers",
            image: "http://localhost:3001/assets/burger.PNG"
          },
          {
            name: "Milkshakes",
            image: "http://localhost:3001/assets/milkshake.PNG"
          },
          {
            name: "Ice Creams",
            image: "http://localhost:3001/assets/icecream.PNG"
          },
          {
            name: "Curry",
            image: "http://localhost:3001/assets/curry.PNG"
          },
          {
            name: "Rotis",
            image: "http://localhost:3001/assets/roti.PNG"
          },
          {
            name: "Wraps",
            image: "http://localhost:3001/assets/wraps.PNG"
          },
          {
            name: "Pastry",
            image: "http://localhost:3001/assets/pastry.PNG"
          },
          {
            name: "Dosa",
            image: "http://localhost:3001/assets/dosa.PNG"
          },
          {
            name: "Idli",
            image: "http://localhost:3001/assets/idli.PNG"
          },
          {
            name: "Pizza",
            image: "http://localhost:3001/assets/pizza.PNG"
          }
        ]
      },
    ]
  };
  res.json(data);
});

module.exports = router;
