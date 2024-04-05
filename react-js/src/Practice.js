import React from "react";

const Practice = () => {
  function getMaxLengthOfString(str) {
    // Create an object to store the last index where each character appeared
    let indexOfString = {};
    // Initialize the start index of the current substring
    let start = 0;
    // Initialize the maximum length of the substring without repeating characters
    let maxLength = 0;

    // Loop through each character in the input string
    for (let i = 0; i < str.length; i++) {
      // Check if the current character is already in the indexOfString object
      // and if its last occurrence is after or equal to the current start index
      if (str[i] in indexOfString && indexOfString[str[i]] >= start) {
        // If true, update the start index to the next character after the last occurrence
        start = indexOfString[str[i]] + 1;
      }

      // Update the last index where the current character appeared
      indexOfString[str[i]] = i;

      // Update the maximum length of the substring without repeating characters
      maxLength = Math.max(maxLength, i - start + 1);
    }

    // Return the maximum length of the substring without repeating characters
    return maxLength;
  }

  // Call the function with the input "pwwkew"
  let result = getMaxLengthOfString("pwwkew");

  // Output the result
  // console.log("Result:", result);

  // let name = "ranjit baldaniya iamsoftwaredeveloper";

  // console.log( "==>",splitedName);

  // function getMax(name) {
  //   let splitedName = name.split(" ");
  //   let longetWord = "";

  //   for (let i = 0; i < splitedName.length; i++) {
  //     if (splitedName[i].length >= longetWord.length) {
  //       longetWord = splitedName[i];
  //     }
  //   }
  //   return longetWord;
  // }
  // let res = getMax(name)
  //   console.log("123" , res)

  //   splitedName.forEach((item)=> console.log("item" , item))

  const getMaxLength = (string) => {};

  // const resu = getMaxLength("my name is ranjit")

  const population = {
    male: 4,
    female: 93,
    others: 10,
  };

  const keys = Object.keys(population);
  const value = Object.values(population);
  const entries = Object.entries(population);

  // console.log("1412", keys);
  // console.log("14123", value);
  // console.log("141234", entries);
  //
  // let array;

  // for (array of entries) {
  //   console.log("array" ,array);
  //   array.forEach(([key, value]) => {
  //     console.log("alll===> ", key[0], value[0]);
  //   });
  // }

  return <div>Practice</div>;
};

export default Practice;

// function getMaxLengthOfStr(str) {
//   let indexOfString = {};
//   let start = 0;
//   let maxLength = 0;
//   let startIndex = 0;

//   for (let i = 0; i < str.length; i++) {
//     console.log("str", str[i]);

//     if (str[i] in indexOfString && indexOfString[str[i]] >= start) {
//       start = indexOfString[str[i]] + 1;
//     }

//     indexOfString[str[i]] = i;
//     console.log("str ===>", i - start + 1);

//     // maxLength = Math.max(maxLength, i - start + 1);
//     if (i - start + 1 > maxLength) {
//       maxLength = i - start + 1;
//       startIndex = start;
//     }
//   }
//   console.log("max length ===>", startIndex , maxLength);

//   return str.slice(startIndex, startIndex + maxLength);
// }

// const run = getMaxLengthOfStr("abcabcabcdbb");

// console.log("run ==>", run);

// const stringMaxLength = (str) => {
//   let indexOfString = {};
//   let start = 0;
//   let maxLength = 0;
//   let startIndex = 0;
//   for (let i = 0; i < str.length; i++) {
//     if (str[i] in indexOfString && indexOfString[str[i]] > start) {
//       start = indexOfString[str[i]] + 1;
//     }

//     indexOfString[str[i]] = i;

//     if (i - start + 1 > maxLength) {
//       maxLength = i - start + 1;
//       startIndex = start;
//     }
//   }
//   return maxLength;
// };
// const run = stringMaxLength("abcabcabcdbb");

// console.log("run ==>", run);

//fectorial function

function fectorialOfNumber(n) {
  if (n === 0 || n === 1) {
    return 1;
  } else {
    return n * fectorialOfNumber(n - 1);
  }
}

let res = fectorialOfNumber(5);

// console.log("res", res);

// flate array

let array = [1, 2, [12, 12], [0, 45, 1], [5, [4, 5]]];

function getSingleArray(array) {
  return array.flat().flat();
}

function flattenArray(array) {
  return array.reduce(function (flat, toFlatten) {
    return flat.concat(
      Array.isArray(toFlatten) ? flattenArray(toFlatten) : toFlatten
    );
  }, []);
}

const flaternarray = flattenArray(array);

// console.log("res", flaternarray.reduce((total , num) =>total + num ));

function getMaxNumFromArray(flaternarray) {
  let max = flaternarray[0];

  for (let i = 0; i <= flaternarray.length; i++) {
    if (flaternarray[i] > max) {
      max = flaternarray[i];
    }
  }
  return max;
}

// console.log("max num==>", getMaxNumFromArray(flaternarray));

function sortStrings(arr) {
  return arr.slice().sort();
}
// Example usage:
const unsortedArray = ["Banana", "Apple", "Orange", "Grape"];
const sortedArray = sortStrings(unsortedArray);
// console.log(sortedArray);

let name = "ranjit baldaniya";

// console.log("namee===>", name.split(" "));

let num = [5, 3, 2, 1, 5, 9, 6, 8, 4, 7, 5, 5, 5, 1, 2, 3, 6, 7];

// console.log("odd" , num.filter((num) => num%2 !== 0))

// Write a JavaScript program to create a class called "Person" with properties for name, age and country.
//Include a method to display the person's details. Create two instances of the 'Person' class and display their details.

class Person {
  constructor(name, age, country) {
    this.name = name;
    this.age = age;
    this.country = country;
  }

  getPersonDetails() {
    console.log(this.name);
  }
}

let p1 = new Person("ranjit", 27, "India");

//  p1.getPersonDetails()

//  Write a JavaScript for loop that iterates from 0 to 15.
//  For each iteration, it checks if the current number is odd or even, and displays a message on the screen.

const getOddEven = (n) => {
  for (let i = 1; i <= n; i++) {
    // console.log(i)
    if (i % 2 == 0) {
      console.log("odd ==>", i);
    } else {
      console.log("even ==>", i);
    }
  }
};
// getOddEven(15)

//print start

const starPattern = (n) => {
  let x, y, char;

  for (let x = 1; x <= 6; x++) {
    for (let y = 1; y < x; y++) {
      char = char + "*";
    }
    console.log(char);
  }
  char = "";
};

// starPattern();

class Vehicel {
  constructor(name, model, price) {
    this.name = name;
    this.model = model;
    this.price = price;
  }

  getCarDetails() {
    console.log(
      "card details",
      "name =",
      this.name,
      "model =",
      this.model,
      "price =",
      this.price
    );
  }
}

let car1 = new Vehicel("Sail", 2014, "6 lakh");

car1.getCarDetails();

class NewVehical extends Vehicel {
  constructor(name, model, price, color) {
    super(name, model, price);
    this.color = color;
  }
  getNewVehical() {
    console.log(
      "this is new vehical data",
      this.name,
      this.model,
      this.price,
      this.color
    );
  }
}

let car2 = new NewVehical("Cruse", 2020, "16 lakh", "Mat Black");

car2.getNewVehical();



// const unsortedArray1 = ["Banana", "Apple", "Orange", "Grape"];


// console.log("1412" , unsortedArray1.slice().sort()) 