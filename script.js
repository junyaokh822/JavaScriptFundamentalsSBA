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
  // course id validation
  try {
    if (ag.course_id !== course.id) {
      throw new Error(
        `AssignmentGroup ID ${ag.id} doesn't match with CourseInfo ID ${course.id}`
      );
    }

    const validAssignments = {}; // object that stores valid assignments

    for (let i = 0; i < ag.assignments.length; i++) {
      const assignment = ag.assignments[i];
      if (
        isAssignmentDue(assignment.due_at) &&
        assignment.points_possible > 0
      ) {
        validAssignments[assignment.id] = assignment;
      }
    }

    const learnerData = new Map();

    for (let submission of submissions) {
      // loop through all submissions
      const learnerId = submission.learner_id;
      const assignmentId = submission.assignment_id;

      console.log(`\nLearner id: ${learnerId}, assignment id: ${assignmentId}`);

      // Skip if assignment is not valid
      if (!validAssignments[assignmentId]) {
        console.log(`assignment ${assignmentId} not due or invalid`);
        continue;
      }

      // Initialize learner object if first time seeing them
      if (!learnerData.has(learnerId)) {
        learnerData.set(learnerId, {
          id: learnerId,
          scores: {}, // store percentage
          totalScore: 0,
          totalPossible: 0,
        });
        console.log(`Created new entry for learner ${learnerId}`);
      }

      const learner = learnerData.get(learnerId);
      const assignment = validAssignments[assignmentId];

      // Check if submission is late
      const late = isSubmissionLate(
        submission.submission.submitted_at,
        assignment.due_at
      );

      console.log(`Late submission? ${late}`);

      // Calculate score with potential late penalty
      let finalScore = submission.submission.score;
      if (late) {
        const penalty = assignment.points_possible * 0.1;
        finalScore = finalScore - penalty;
        if (finalScore < 0) {
          finalScore = 0;
        }
        console.log(`Applied penalty: ${penalty} points.`);
      }

      // Calculate percentage for this assignment
      const percentage = finalScore / assignment.points_possible;

      // Store in learner's scores object
      learner.scores[assignmentId] = percentage;

      // Update totals for weighted average
      learner.totalScore += finalScore;
      learner.totalPossible += assignment.points_possible;

      console.log(`Percentage: ${percentage.toFixed(2)}.`);
      console.log(
        `updated totals: ${learner.totalScore}/${learner.totalPossible}`
      );
    }

    // Convert Map to array format for output
    const result = [];
    for (let [learnerId, data] of learnerData) {
      // Calculate overall average
      const avg =
        data.totalPossible > 0 ? data.totalScore / data.totalPossible : 0;

      // Create result object
      const learnerResult = {
        id: data.id,
        avg: parseFloat(avg.toFixed(3)),
      };

      // Add individual assignment scores
      for (let assignmentId in data.scores) {
        learnerResult[assignmentId] = parseFloat(
          data.scores[assignmentId].toFixed(3)
        );
      }

      result.push(learnerResult);
    }
    console.log();

    console.log(`Final learner's data:`, result);
    return result;
  } catch (error) {
    console.error("There's error in getLearnerData:", error.message);
    return [];
  }
}

getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
// const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
// console.log(result);

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
