import { FinishingStatus, iConstructorFantasyScore, iDriverFantasyScore, iJolpicaResult } from "@f1pick6/shared";
import { logger } from "firebase-functions";

export function generateFantasyScores(results: iJolpicaResult[]) {
  const returnObj: { [key: string]: iDriverFantasyScore | iConstructorFantasyScore } = {};

  const driverCount = results.length;

  // loop through each drivers result
  results.forEach((result) => {
    const driverId = result.Driver.driverId;
    const teamId = result.Constructor.constructorId;
    const finishingPosition = parseInt(result.position);
    const startingPosition = parseInt(result.grid);
    const finishingStatus = getFinishingStatus(result.status.toUpperCase());
    const didDnf = finishingStatus !== FinishingStatus.FINISHED;

    const {raceFantasyPoints, qualFantasyPoints} = calculateFantasyPoints(finishingPosition, startingPosition, driverCount, didDnf);
    
    const driverScore: iDriverFantasyScore = {
      driverId,
      dnf: didDnf,
      totalFantasyPoints: raceFantasyPoints + qualFantasyPoints,
      raceStartPosition: startingPosition,
      raceEndPosition: finishingPosition,
      raceFantasyPoints,
      qualFantasyPoints,
      finishingStatus,
      constructor: result.Constructor.constructorId, // add this to check if the driver has moved teams
      constructorName: result.Constructor.name // """"
    }

    const constructorScore: iConstructorFantasyScore = {
      dnf: didDnf,
      totalFantasyPoints: raceFantasyPoints + qualFantasyPoints,
      raceFantasyPoints,
      qualFantasyPoints,
      driverScores: []
    }

    returnObj[driverId] = driverScore;
    
    // if it doesn't exist yet, create the constructor object
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

function calculateFantasyPoints(finishingPosition: number, startingPosition: number, driverCount: number, didDnf: boolean) {
  let returnObj = {
    raceFantasyPoints: 0,
    qualFantasyPoints: 0
  }

  /**
   * QUALIFICATION
   */
  // 10pts for front row (1st or 2nd)
  // 5pts for 3rd-10th,
  if (startingPosition <= 2) {
    returnObj.qualFantasyPoints = 10;
  } else if (startingPosition <= 10) {
    returnObj.qualFantasyPoints = 5;
  }

  /**
   * RACE
   */
  // -5pts for DNF, 
  // 2pts for last place, then +2pts for each position after that
  if (didDnf) {
    returnObj.raceFantasyPoints = -5;
  } else {
    returnObj.raceFantasyPoints += (driverCount * 2 + 1) - finishingPosition
  }

  return returnObj;
}