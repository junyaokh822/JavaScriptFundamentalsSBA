// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript",
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50,
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150,
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500,
    },
  ],
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47,
    },
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150,
    },
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400,
    },
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39,
    },
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140,
    },
  },
];

//check if assignment is due
function isAssignmentDue(due_at) {
  const dueDate = new Date(due_at);
  const currentDate = new Date();
  return currentDate >= dueDate; //return true if assignment is due
}

//check if submission is late
function isSubmissionLate(submitted_at, due_at) {
  const submittedDate = new Date(submitted_at);
  const dueDate = new Date(due_at);
  return submittedDate > dueDate; //return true if late
}

//calculate the percentage score with late penalty
function calculateScore(score, possiblePoints, isLate = false) {
  if (typeof score !== "number" || typeof possiblePoints !== "number") {
    throw new Error(`score and possiblePoints has to be numbers!`);
  }

  if (possiblePoints === 0) {
    throw new Error(`possiblePoints can't be 0`);
  }

  let finalScore = score;
  if (isLate) {
    const penalty = possiblePoints * 0.1;
    finalScore = score - penalty;
    if (finalScore < 0) {
      // the lowest score will be 0
      finalScore = 0;
    }
  }
  return finalScore / possiblePoints; // return the percentage score
}

function getLearnerData(course, ag, submissions) {
  //couse id validation
  try {
    if (ag.course_id !== course.id) {
      //AssignmentGroup.id != courseInfo.id
      throw new Error(
        `AssignmentGroup ID ${ag.id} doesn't match with CourseInfo ID ${course.id}`
      );
    }
    const validAssignments = {}; // object that store valid assignments
    for (let i = 0; i < ag.assignments.length; i++) {
      const assignment = ag.assignments[i];
      const assignmentId = assignment.id;

      if (isAssignmentDue(assignment.due_at)) {
        // only store assignments that are due
        if (assignment.points_possible <= 0) {
          throw new Error(
            `possible points can't be equal or lower than 0 for assignment ${assignmentId}.`
          );
        }
        validAssignments[assignmentId] = {
          ...assignment,
          due_at: assignment.due_at,
          points_possible: assignment.points_possible,
        };
        console.log(`Assignment ${assignmentId} is due`);
      } else {
        console.log(`Assignment ${assignmentId} is not due`);
      }
    }

    console.log(`Total assignment: ${Object.keys(validAssignments).length}`);
  } catch (error) {
    console.error("There's error in getLearnerData:", error.message);
  }
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);

// here, we would process this data to achieve the desired result.
//   const result = [
//     {
//       id: 125,
//       avg: 0.985, // (47 + 150) / (50 + 150)
//       1: 0.94, // 47 / 50
//       2: 1.0 // 150 / 150
//     },
//     {
//       id: 132,
//       avg: 0.82, // (39 + 125) / (50 + 150)
//       1: 0.78, // 39 / 50
//       2: 0.833 // late: (140 - 15) / 150
//     }
//   ];

// Thing to keep in mind:

//Relationships between objects
//   -Reread, reread, reread the prompt
//   -Create Data Model relationship diagram
//Break down the problem into plain language steps before starting
//You DO NOT NEED TO USE Date() class - date is given as a string (turn it into an array for easy compairison).
//   -Use current year as current date
//Try Catch used around the main logic
//Main function was already created for you, so use it
//The whole logic revolves around 1 main loop!!!!!
//Refer to the expected output.
