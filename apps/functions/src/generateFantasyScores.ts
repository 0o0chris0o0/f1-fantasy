import { FinishingStatus, iConstructorFantasyScore, iDriverFantasyScore, iJolpicaResult } from "@f1pick6/shared";
import { logger } from "firebase-functions";

export function generateFantasyScores(results: iJolpicaResult[]) {
  const returnObj: { [key: string]: iDriverFantasyScore | iConstructorFantasyScore } = {};

  results.forEach((result) => {
    const driverId = result.Driver.driverId;
    const teamId = result.Constructor.constructorId;
    const finishingPosition = parseInt(result.position);
    const startingPosition = parseInt(result.grid);
    const finishingStatus = getFinishingStatus(result.status.toUpperCase());
    const didDnf = finishingStatus !== FinishingStatus.FINISHED;

    const {raceFantasyPoints, qualFantasyPoints} = calculateFantasyPoints(finishingPosition, startingPosition, didDnf);
    
    const driverScore: iDriverFantasyScore = {
      driverId,
      dnf: didDnf,
      totalFantasyPoints: raceFantasyPoints + qualFantasyPoints,
      raceStartPosition: `P${startingPosition}`,
      raceEndPosition: `P${finishingPosition}`,
      raceFantasyPoints,
      qualFantasyPoints
    }

    const constructorScore: iConstructorFantasyScore = {
      dnf: didDnf,
      totalFantasyPoints: raceFantasyPoints + qualFantasyPoints,
      raceFantasyPoints,
      qualFantasyPoints,
      driverScores: []
    }

    returnObj[driverId] = driverScore;
    
    if (!returnObj[teamId]) {
      returnObj[teamId] = {
        dnf: didDnf, // Teams can't DNF, but this will be used to indicate if both drivers DNFed
        totalFantasyPoints: constructorScore.totalFantasyPoints,
        raceFantasyPoints: constructorScore.raceFantasyPoints,
        qualFantasyPoints: constructorScore.qualFantasyPoints,
        driverScores: [driverScore]
      };
    } else {
      const teamScore = returnObj[teamId] as iConstructorFantasyScore;
      teamScore.totalFantasyPoints += constructorScore.totalFantasyPoints;
      teamScore.raceFantasyPoints += constructorScore.raceFantasyPoints;
      teamScore.qualFantasyPoints += constructorScore.qualFantasyPoints;
      teamScore.driverScores?.push(driverScore);

      // if both this driver and the previous DNF'ed then set the team as DNFed
      if (didDnf && teamScore.dnf) {
        teamScore.dnf = true; // If both drivers DNF, the team is considered to have DNFed
      }
    }

  });

  return returnObj;
}

function getFinishingStatus(status: string) {
  if (!FinishingStatus[status as keyof typeof FinishingStatus]) {
    logger.warn(`Unknown finishing status: ${status}`);
    return FinishingStatus.UNKNOWN
  } else {
    return FinishingStatus[status as keyof typeof FinishingStatus];
  }
}

function calculateFantasyPoints(finishingPosition: number, startingPosition: number, didDnf: boolean) {
  let returnObj = {
    raceFantasyPoints: 0,
    qualFantasyPoints: 0
  }

  // 10pts for front row (1st or 2nd)
  // 5pts for 3rd-10th,
  // 2pts for 11th-15th, 
  // 1pt for the rest of the grid
  if (startingPosition <= 2) {
    returnObj.qualFantasyPoints = 10;
  } else if (startingPosition <= 10) {
    returnObj.qualFantasyPoints = 5;
  } else if (startingPosition <= 15) {
    returnObj.qualFantasyPoints = 2;
  } else {
    returnObj.qualFantasyPoints = 1;
  }

  // -5pts for DNF, 
  // 20pts for podium (top 3),
  // 10pts for 4th-10th,
  // 5pts for 11th-15th, 
  // 1pt for the rest of the grid
  if (didDnf) {
    returnObj.raceFantasyPoints = -5;
  } else if (finishingPosition <= 3) {
    returnObj.raceFantasyPoints = 20;
  } else if (finishingPosition <= 10) {
    returnObj.raceFantasyPoints = 10;
  } else if (finishingPosition <= 15) {
    returnObj.raceFantasyPoints = 5;
  } else {
    returnObj.raceFantasyPoints = 1;
  }

  return returnObj;
}