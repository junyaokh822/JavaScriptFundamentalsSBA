# Learner Data Analyzer

A JavaScript application that calculates student performance metrics based on assignment submissions.

## Overview

This project processes course assignments and learner submissions to calculate weighted averages and individual assignment scores. It handles late submissions with automatic penalty deductions.

## Features

- Validates assignment groups against course information
- Filters assignments based on due dates
- Applies 10% penalty for late submissions
- Calculates weighted averages across all assignments
- Returns formatted learner data with scores rounded to three decimal places

## Usage

The main function `getLearnerData()` takes three parameters:

```javascript
getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
```

**Parameters:**

- `CourseInfo` - Object containing course ID and name
- `AssignmentGroup` - Object with assignment details and course ID
- `LearnerSubmissions` - Array of learner submission objects

**Returns:**
An array of objects containing:

- `id` - Learner ID
- `avg` - Weighted average score
- Individual assignment scores (by assignment ID)

## Example Output

```javascript
[
  {
    1: 0.94,
    2: 1,
    id: 125,
    avg: 0.985,
  },
  {
    1: 0.78,
    2: 0.833,
    id: 132,
    avg: 0.82,
  },
];
```

## How It Works

1. Validates the assignment group belongs to the specified course
2. Filters out assignments that aren't yet due or have zero points
3. Processes each submission and applies late penalties if needed
4. Calculates percentage scores for each assignment
5. Computes weighted averages based on total points earned vs. total points possible

## Error Handling

The application includes error handling for:

- Mismatched course and assignment group IDs
- Invalid score or points data
- Division by zero scenarios

## Project Reflection

**What could you have done differently during the planning stages?**

I could have create Data Model relationship diagram before coding to make implementation smoother.

**Were there any requirements that were difficult to implement?**

Transforming between arrays and objects was tricky when organizing the data. Better planning of the data structure would have made this smoother.

**What would you add or change if given more time?**

I would add more error handling for validation to make the code more robust and easier to debug.

**Notes for future self:**

Break complex logic into small helper functions and validate data early. Date comparisons need careful handling, and console.log statements are helpful for debugging data flow.
