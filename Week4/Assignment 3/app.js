function assignment3(){ 
    //Use this function to call solution functions of other questions 
    let names = ['Amy', 'Jake', 'Sara', 'Liam', 'Robert', 'Harry', 'Liam', 'Jake', 'Sara', 'Taylor', 'Kathy',                'Amy', 'Jake', 'Harry', 'Nina', 'Robert', 'Harry']
    question0()
    question1(5)
    question2()
    question3()
    question4()

}
question0=function(){
    document.getElementById('q0').innerHTML="Note: Here is how you can change HTML data from app.js --- Refer question0 in app.js"
}
question1=function(n){
    //This function prints the pattern mentioned in Question 1
    //You should not hard code the pattern in arrays.
    //This pattern should be generated using JS code (for loops and if-else statements)
    const target = document.getElementById("q1");
    let starCount = 1;
    let buffer = n - 1;
    for (let i = 0; i < n; i ++) {
        target.innerHTML += `<pre>${" ".repeat(buffer)}${"*".repeat(starCount)}</pre>`
        starCount += 2;
        buffer--;
    }
}

question2=function(){
    // Print the {Name:Count} data structure to the console and the names which occur more than 2 times in index.html.
    let temp32 = ['Amy', 'Jake', 'Sara', 'Liam', 'Robert', 'Harry', 'Liam', 'Jake', 'Sara', 'Taylor', 'Kathy',                'Amy', 'Jake', 'Harry', 'Nina', 'Robert', 'Harry']
    const target = document.getElementById("q2")

    // p1
    let counts = new Object;
    for (let name of temp32) {
        if (name in counts) { counts[name]++ } else { counts[name] = 1 }
    }
    console.log(counts)

    // p2
    for (let name of Object.keys(counts)) {
        (counts[name] > 2) ? target.innerHTML += name + ", " : undefined
    }
}


question3=function(){
    //Do not change this implementation. Implement your solution inside the callback
    $.getJSON('./data.json').then(data=>{
        //Your solution goes here. Tip: try console.log(data) to see how data is structured.
        

    });
    
}
question4=function(){
    //Do not change this implementation. Implement your solution inside the callback
    $.getJSON('./data.json').then(data=>{
        //Your solution goes here. Tip: try console.log(data) to see how data is structured.
        
    })
    
}



