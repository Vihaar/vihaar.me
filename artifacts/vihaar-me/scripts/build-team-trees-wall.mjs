#!/usr/bin/env node
/**
 * Build donors-wall.json — Team Trees style with Indian names.
 * LLM-authored names + messages. Preserves timestamps.
 * Top 3: Pankaj Chaddah 50k meals, Ramesh Kumar 12,340, Vihaar Nandigala 10k.
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const timestamps = JSON.parse(readFileSync("/tmp/donor-timestamps.json", "utf-8"));

const TARGET = 3225300;
const TOP3 = [
  { primary: "Pankaj Chaddah", amountCents: 500000, note: "For every child who deserves a full plate" },
  { primary: "Ramesh Kumar", amountCents: 123400, note: "Annadaan — feeding is sacred" },
  { primary: "Vihaar Nandigala", amountCents: 100000, note: "Go team! 🙏" },
];

// LLM-authored: Team Trees style — mix of Anonymous, Indian names, groups, creative handles
const NAME_MESSAGES = [
  { primary: "Anonymous", note: "For our generation & future generations" },
  { primary: "Anonymous", note: "Every plate counts" },
  { primary: "Anonymous", note: "For the kids" },
  { primary: "Anonymous", note: "Jai hind" },
  { primary: "Anonymous" },
  { primary: "Aarav Sharma", note: "I like meals! 🍚🥘" },
  { primary: "Aditi & Naina", note: "From Mumbai — for Chennai" },
  { primary: "Amit Verma", note: "For my village" },
  { primary: "Ananya Reddy", note: "Full bellies, bright futures" },
  { primary: "Arjun Patel", note: "Go Meals!" },
  { primary: "Team Full Plates", secondary: "Riya, Kabir & Priya", note: "18 = 3 + 6 + 9 (our ages!)" },
  { primary: "Ashwin Iyer", note: "For luck" },
  { primary: "Avni Kapoor", note: "Thankful for this cause" },
  { primary: "Bhavya Nair", note: "From the diaspora" },
  { primary: "Chai & Chapati", note: "Buy 1 Get 1 Meals" },
  { primary: "Daniel", note: "100 meals" },
  { primary: "Deepak Joshi", note: "Keep going" },
  { primary: "Dev Krishnan", note: "Meals give hope" },
  { primary: "Dhruv Mehta" },
  { primary: "Divya Rao", note: "For the midday meal" },
  { primary: "Emma" },
  { primary: "Geeta Nambiar", note: "In Amma's memory" },
  { primary: "Aadish Mehta", secondary: "Green Flag Initiative", note: "Aiming to reduce hunger" },
  { primary: "Harsh Gupta", note: "SaveTheMeals" },
  { primary: "Isha Banerjee", note: "1 meal" },
  { primary: "ILoveMeals", secondary: "Kavita Desai", note: "Meals give kids energy" },
  { primary: "Karthik Pillai", note: "For school kitchens" },
  { primary: "Kavya Bhatt", note: "From Bangalore" },
  { primary: "Kaylee's parents", note: "Thankful they made my good friend Kaylee" },
  { primary: "Kiran Menon", note: "From our family" },
  { primary: "Komal Saxena", note: "Chota sa contribution" },
  { primary: "Liam", note: "I LIKE MEALS 🌳:D" },
  { primary: "Maya Chatterjee", note: "For full stomachs" },
  { primary: "Maxi Wood-Rose", note: "Diddy Bawlz" },
  { primary: "Meera Venkatesh", note: "From Pune" },
  { primary: "Nandini Ghosh", note: "Every bit helps" },
  { primary: "Neha Das", note: "From Hyderabad" },
  { primary: "Nikhil Roy", note: "Donation" },
  { primary: "Noah", note: "SaveTheMeals" },
  { primary: "Pooja Malhotra", note: "For a full belly" },
  { primary: "Prisha Agarwal", note: "From Delhi" },
  { primary: "Raghav Tiwari", note: "Go Meals!" },
  { primary: "Rajesh Dubey", note: "From Kolkata" },
  { primary: "Ravi Oberoi", note: "One meal at a time" },
  { primary: "Rhea Seth", note: "Namaste" },
  { primary: "Rishabh Bhatia", note: "Dhanyavaad" },
  { primary: "Rohan Chopra", note: "Shukriya" },
  { primary: "Alex, Emma, Olivia, Virgil", note: "From Rowe Elementary School Portland ME" },
  { primary: "Sameer Mehra", note: "For our kids' future" },
  { primary: "Sanjay Thakur", note: "From Ahmedabad" },
  { primary: "Sarita Bansal", note: "In Nani's name" },
  { primary: "Shreya Kulkarni", note: "Much love" },
  { primary: "Sneha Jain", note: "Here's to full plates" },
  { primary: "Sonali Shah", note: "Bless you" },
  { primary: "Sunita Bose", note: "Small step" },
  { primary: "Suresh Murthy", note: "Happy to help" },
  { primary: "Swati Rajan", note: "For Kerala" },
  { primary: "Tanvi Balakrishnan", note: "From Lucknow" },
  { primary: "CV service team", note: "Anonymous" },
  { primary: "CVService Team", note: "Go Canyon View!" },
  { primary: "The Hermitage", secondary: "Autumn Glow and Lady Shenandoah", note: "1st and 4th!" },
  { primary: "Thomas", note: "I like meals! 🎄🍚🥘" },
  { primary: "Vandana Swamy", note: "For Tamil Nadu" },
  { primary: "Varun Sundaram", note: "From Jaipur" },
  { primary: "Vikram Subramanian", note: "For Andhra" },
  { primary: "Vivek Venkatesh", note: "For Karnataka" },
  { primary: "Vitor Valente" },
  { primary: "Holly Jones", note: "For luck" },
  { primary: "Kaitlin" },
  { primary: "Alex Davenport" },
  { primary: "Asher" },
  { primary: "Bodhi Chase", note: "GoMeals!" },
  { primary: "Ethan Halpern", secondary: "trees" },
  { primary: "Not even ed Sheeran", note: "Keep going" },
  { primary: "Trees will Save Us" },
  { primary: "Thrifter: Swipe Secondhand", note: "Buy 1 Get 1 Meals" },
  { primary: "Team Rainbow Meals", secondary: "Benjamin, Olivia & Nicholas" },
  { primary: "Ritika Pandey", note: "From Surat" },
  { primary: "Abhay Mishra", note: "For Gujarat" },
  { primary: "Kriti Yadav", note: "In Thatha's name" },
  { primary: "Anil Tiwari", note: "For the next generation" },
  { primary: "Jyoti Rao", note: "Grateful" },
  { primary: "Manish Pillai", note: "Feed them well" },
  { primary: "Padmini Nair", note: "In Dadi's memory" },
  { primary: "Venkat Krishnan", note: "From Chennai" },
  { primary: "Padma Gupta", note: "For full hearts" },
  { primary: "Gopal Joshi", note: "Small but heartfelt" },
  { primary: "Lata Sharma", note: "In Dad's name" },
  { primary: "Rekha Patel", note: "Thank you for doing this" },
  { primary: "Mukesh Reddy", note: "From the crew" },
  { primary: "Usha Iyer", note: "You've got this" },
  { primary: "Anand Verma", note: "Proud of you" },
  { primary: "Rohan Bhatia", note: "— with love" },
  { primary: "Kiara Malhotra", note: "For Chandigarh" },
  { primary: "Vivaan Saxena" },
  { primary: "Aaradhya Tiwari", note: "From Goa" },
  { primary: "Advik Oberoi", note: "One meal at a time" },
  { primary: "Anvi Chatterjee", note: "For Bihar" },
  { primary: "Armaan Mukherjee", note: "Annadaan 🙏" },
  { primary: "Arya Venkatesh", note: "From Kerala" },
  { primary: "Ayaan Balakrishnan", note: "For Madhya Pradesh" },
  { primary: "Diya Subramanian", note: "Chalo" },
  { primary: "Ishita Rao", note: "In memory of Papa" },
  { primary: "Myra Banerjee", note: "From Odisha" },
  { primary: "Reyan Ghosh", note: "For Rajasthan" },
  { primary: "Reyansh Bose", note: "Dhanyavaad" },
  { primary: "Rudra Das", note: "From Punjab" },
  { primary: "Saanvi Sen", note: "Shukriya" },
  { primary: "Shanaya Roy", note: "For Uttar Pradesh" },
  { primary: "Ved Khanna", note: "Namaste" },
  { primary: "Zara Agarwal", note: "From Haryana" },
  { primary: "The Patel Family", note: "From our family" },
  { primary: "The Reddy Family", note: "For the kids" },
  { primary: "The Sharma Family", note: "In Amma's name" },
  { primary: "The Iyer Family", note: "Annadaan" },
  { primary: "The Gupta Family", note: "For school kitchens" },
  { primary: "The Kapoor Family", note: "Full hearts" },
  { primary: "NoKidHungry" },
  { primary: "FullPlates Fund", note: "Every plate counts" },
  { primary: "Share A Meal Collective" },
  { primary: "Team Lunch United", note: "Go team!" },
  { primary: "School Lunch Angels" },
  { primary: "Pantry Partners United", note: "For full stomachs" },
  { primary: "Meals4Kids Bangalore" },
  { primary: "Chennai Feeds", note: "From Chennai" },
  { primary: "Mumbai Annadaan" },
  { primary: "Delhi Lunch Club" },
  { primary: "Kolkata Kitchen" },
  { primary: "Hyderabad Hearts", note: "For Andhra" },
  { primary: "Pune Plates" },
  { primary: "Ahmedabad Angels" },
  { primary: "Vishal Kumar", note: "Keep going!" },
  { primary: "Gaurav Nambiar", note: "For the next gen" },
  { primary: "Mansi Subramanian", note: "Bless you" },
  { primary: "Kartik Venkatesh", note: "Thank you" },
  { primary: "Abhishek Pillai", note: "From Bangalore" },
  { primary: "Kriti Mukherjee", note: "Much love" },
  { primary: "Ramesh Bose", note: "For Kerala" },
  { primary: "Sarita Das", note: "In Nani's memory" },
  { primary: "Vinod Roy", note: "From Mumbai" },
  { primary: "Praveen Chatterjee", note: "Every bit helps" },
  { primary: "Geeta Banerjee", note: "Small step" },
  { primary: "Manoj Ghosh", note: "For Tamil Nadu" },
  { primary: "Kavita Subramanian", note: "Happy to help" },
  { primary: "Suresh Rao", note: "From Delhi" },
  { primary: "Lata Malhotra", note: "For full bellies" },
  { primary: "Rajeev Saxena", note: "Proud of you" },
  { primary: "Usha Tiwari", note: "You've got this" },
  { primary: "Anand Oberoi", note: "Go Meals!" },
  { primary: "Vandana Chatterjee", note: "From Pune" },
  { primary: "Santosh Mukherjee", note: "In Thatha's name" },
  { primary: "Rekha Banerjee", note: "For Karnataka" },
  { primary: "Mukesh Ghosh", note: "Chota sa contribution" },
  { primary: "Padmini Das", note: "From Hyderabad" },
  { primary: "Srinivas Roy", note: "For Gujarat" },
  { primary: "Lakshmi Chatterjee", note: "Feed them well" },
  { primary: "Venkat Bose", note: "Grateful" },
  { primary: "Padma Mukherjee", note: "For our kids' future" },
  { primary: "Gopal Banerjee", note: "One meal at a time" },
  { primary: "James Smith", note: "From the diaspora" },
  { primary: "Sarah Williams", note: "For India" },
  { primary: "Michael Brown", note: "Keep going" },
  { primary: "Emily Davis", note: "Full plates" },
  { primary: "David Garcia", note: "Every plate counts" },
  { primary: "Jessica Martinez", note: "For the kids" },
  { primary: "Daniel Rodriguez", note: "Thank you" },
  { primary: "Olivia Lee", note: "Much love" },
  { primary: "Matthew Kim", note: "Go team!" },
  { primary: "Sophia Johnson", note: "From our family" },
  { primary: "Andrew Brown", note: "Bless you" },
  { primary: "Isabella Davis", note: "Happy to help" },
  { primary: "Christopher Garcia", note: "For school meals" },
  { primary: "Mia Martinez", note: "Small but heartfelt" },
  { primary: "Ryan Rodriguez", note: "You've got this" },
  { primary: "Emma Lee", note: "Proud of you" },
  { primary: "Kevin Kim", note: "Here's to full plates" },
  { primary: "Ava Johnson", note: "Every bit helps" },
  { primary: "Brian Williams", note: "For full stomachs" },
  { primary: "Charlotte Brown", note: "In memory" },
];

// Team Trees style amounts (cents): lots of small, some medium. 10 meals=$1=100, 50=$5=500, 100=$10=1000, etc.
const AMOUNT_PATTERN = [
  100, 500, 500, 1000, 500, 500, 1000, 500, 2500, 500, 500, 1000, 500, 500,
  500, 1000, 500, 5000, 500, 1000, 500, 500, 2500, 500, 500, 1000, 500, 500,
  100, 500, 1000, 500, 500, 500, 1000, 2500, 500, 500, 5000, 500, 1000, 500,
  500, 500, 1000, 500, 500, 2500, 500, 1000, 500, 500, 500, 10000, 500, 500,
  1000, 500, 500, 500, 2500, 500, 1000, 500, 500, 500, 500, 1000, 500, 5000,
];

const N = 4000;
const REST_SUM = TARGET - 500000 - 123400 - 100000;

// Build amounts for donors 4–4000
let amounts = [];
while (amounts.length < N - 3) amounts.push(...AMOUNT_PATTERN);
amounts = amounts.slice(0, N - 3);
let sum = amounts.reduce((a, b) => a + b, 0);
amounts[amounts.length - 1] += REST_SUM - sum;

// Build donors
const donors = [];
for (let i = 0; i < 3; i++) {
  donors.push({
    primary: TOP3[i].primary,
    note: TOP3[i].note,
    amountCents: TOP3[i].amountCents,
    donatedAt: timestamps[i],
  });
}
// Deterministic shuffle: use prime stride so names don't repeat in obvious runs
const NM_LEN = NAME_MESSAGES.length;
for (let i = 3; i < N; i++) {
  const nm = NAME_MESSAGES[(i * 17 + i % 7) % NM_LEN];
  const d = {
    primary: nm.primary,
    amountCents: amounts[i - 3],
    donatedAt: timestamps[i],
  };
  if (nm.secondary) d.secondary = nm.secondary;
  if (nm.note) d.note = nm.note;
  donors.push(d);
}

donors.sort((a, b) => new Date(b.donatedAt).getTime() - new Date(a.donatedAt).getTime());

const outPath = join(__dirname, "donors-wall.json");
writeFileSync(outPath, JSON.stringify(donors, null, 0));
console.log(`Wrote ${N} donors to ${outPath}`);
console.log(`Sum: $${(donors.reduce((a, d) => a + d.amountCents, 0) / 100).toLocaleString()}`);
console.log("Top 3:", donors.slice(0, 3).map((d) => `${d.primary}: ${d.amountCents / 10} meals`));
