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
    for (let assignment of ag.assignments) {
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

      // Skip if assignment is not valid
      if (!validAssignments[assignmentId]) {
        continue;
      }

      // Initialize learner if needed
      if (!learnerData.has(learnerId)) {
        learnerData.set(learnerId, {
          id: learnerId,
          scores: {},
          totalScore: 0,
          totalPossible: 0,
        });
      }

      const learner = learnerData.get(learnerId);
      const assignment = validAssignments[assignmentId];

      // Check if submission is late
      const late = isSubmissionLate(
        submission.submission.submitted_at,
        assignment.due_at
      );

      // Calculate score with potential late penalty
      let finalScore = submission.submission.score;
      if (late) {
        const penalty = assignment.points_possible * 0.1;
        finalScore = finalScore - penalty;
        if (finalScore < 0) {
          finalScore = 0;
        }
      }

      // Calculate percentage for this assignment
      const percentage = finalScore / assignment.points_possible;

      // Store data
      learner.scores[assignmentId] = percentage;
      learner.totalScore += finalScore;
      learner.totalPossible += assignment.points_possible;
    }

    const result = [];

    //loop through each learner
    for (let [learnerId, data] of learnerData) {
      console.log(`\nFormatting data for learner ${learnerId}:`);
      console.log("Raw data:", data);

      //Calculate weighted average
      let avg = 0;
      if (data.totalPossible > 0) {
        avg = data.totalScore / data.totalPossible;
        avg = Math.round(avg * 1000) / 1000;
      }

      console.log(`weighted average: ${avg}`);

      // Create result object
      const learnerResult = {
        id: learnerId,
        avg: avg,
      };

      // Add each assignment score
      for (let assignmentId in data.scores) {
        learnerResult[assignmentId] =
          Math.round(data.scores[assignmentId] * 1000) / 1000;
        console.log(
          `Assignment ${assignmentId}: ${learnerResult[assignmentId]}`
        );
      }

      //Add to result array
      result.push(learnerResult);
      console.log("Final object:", learnerResult);
    }

    return result;
  } catch (error) {
    console.error("There's error in getLearnerData:", error.message);
    return [];
  }
}
console.log("=== FINAL TEST ===");
const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);
console.log("\n=== FINAL OUTPUT ===");
console.log("const result =", JSON.stringify(result, null, 1));

// desired result:
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
