/**
 * Preventive Care Logic based on USPSTF A/B Recommendations
 * https://www.uspreventiveservicestaskforce.org/uspstf/recommendation-topics/uspstf-a-and-b-recommendations
 */

export type ScreeningStatus = "due_now" | "due_soon" | "up_to_date" | "not_applicable";

export interface ScreeningItem {
  id: string;
  name: string;
  emoji: string;
  status: ScreeningStatus;
  reason: string;
  frequency?: string;
  options?: string[];
}

export interface PreventiveCareProfile {
  dateOfBirth: string;
  sexAtBirth: "male" | "female";
  anatomyPresent: string[];
  isPregnant?: boolean;
  weeksPregnant?: number;
  smokingStatus: "never" | "former" | "current";
  smokingYears?: number;
  packsPerDay?: number;
  quitYear?: number;
  alcoholFrequency: string;
  drinksPerOccasion?: number;
  sexuallyActive?: boolean;
  partnersLast12Months?: number;
  stiHistory?: boolean;
  hivRisk?: boolean;
  conditions: string[];
  cancerTypes?: string[];
  familyHistory: string[];
  heightInches: number;
  weightLbs: number;
  lastBloodPressure?: string;
  lastCholesterol?: string;
  lastDiabetesTest?: string;
  lastColonoscopy?: string;
  lastCervicalScreening?: string;
  lastMammogram?: string;
  lastHivTest?: string;
  lastDepressionScreening?: string;
  zipCode?: string;
  insurancePlan?: string;
  hasPCP?: boolean;
  openToTelehealth?: boolean;
  preferredAppointmentTimes?: string[];
}

// Calculate age from DOB
const calculateAge = (dob: string): number => {
  if (!dob) return 0;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

// Calculate BMI
const calculateBMI = (heightInches: number, weightLbs: number): number => {
  if (heightInches <= 0 || weightLbs <= 0) return 0;
  return (weightLbs / (heightInches * heightInches)) * 703;
};

// Calculate pack-years
const calculatePackYears = (years?: number, packsPerDay?: number): number => {
  if (!years || !packsPerDay) return 0;
  return years * packsPerDay;
};

// Years since quit
const yearsSinceQuit = (quitYear?: number): number => {
  if (!quitYear) return 0;
  return new Date().getFullYear() - quitYear;
};

// Check if test is overdue based on last test date
const isTestOverdue = (
  lastTest: string | undefined,
  yearsUntilDue: number
): boolean => {
  if (!lastTest || lastTest === "never" || lastTest === "not_sure") {
    return true;
  }
  if (lastTest === "within_1_year") {
    return yearsUntilDue < 1;
  }
  if (lastTest === "1_3_years") {
    return yearsUntilDue <= 2;
  }
  if (lastTest === "over_3_years") {
    return true;
  }
  return false;
};

// Determine status from last test
const getStatusFromLastTest = (
  lastTest: string | undefined,
  dueEveryYears: number
): ScreeningStatus => {
  if (!lastTest || lastTest === "never") {
    return "due_now";
  }
  if (lastTest === "not_sure") {
    return "due_now";
  }
  if (lastTest === "within_1_year") {
    return dueEveryYears <= 1 ? "due_soon" : "up_to_date";
  }
  if (lastTest === "1_3_years") {
    return dueEveryYears <= 3 ? "due_now" : "up_to_date";
  }
  if (lastTest === "over_3_years") {
    return "due_now";
  }
  return "due_now";
};

/**
 * Generate personalized screening recommendations based on USPSTF guidelines
 */
export const generateScreeningRecommendations = (
  profile: PreventiveCareProfile
): ScreeningItem[] => {
  const screenings: ScreeningItem[] = [];
  const age = calculateAge(profile.dateOfBirth);
  const bmi = calculateBMI(profile.heightInches, profile.weightLbs);
  const packYears = calculatePackYears(profile.smokingYears, profile.packsPerDay);
  const yearsQuit = yearsSinceQuit(profile.quitYear);
  const hasCervix = profile.anatomyPresent.includes("cervix");
  const hasHypertension = profile.conditions.includes("hypertension");
  const hasHighCholesterol = profile.conditions.includes("high_cholesterol");
  const hasDiabetes = profile.conditions.includes("diabetes");
  const hasHeartDisease = profile.conditions.includes("heart_disease");
  const hasEarlyHeartDiseaseFamily = profile.familyHistory.includes("early_heart_disease");

  // 1. Blood Pressure Screening (Grade A) - Adults 18+
  if (age >= 18) {
    const hasRiskFactors = hasHypertension || hasHeartDisease || bmi >= 30;
    const dueEvery = hasRiskFactors ? 1 : 2; // Annual if risk factors, otherwise every 2 years
    const status = getStatusFromLastTest(profile.lastBloodPressure, dueEvery);
    
    screenings.push({
      id: "blood_pressure",
      name: "Blood Pressure Screening",
      emoji: "🩺",
      status,
      reason: hasHypertension 
        ? "Adult with hypertension - routine monitoring recommended"
        : "Routine screening for adults 18+",
      frequency: hasRiskFactors ? "Annually" : "Every 2 years",
    });
  }

  // 2. Lipid/Cholesterol Screening (Grade B) - Men 35+, Women 45+, or earlier with risk factors
  const lipidAgeThreshold = profile.sexAtBirth === "male" ? 35 : 45;
  const hasLipidRiskFactors = hasDiabetes || hasHypertension || hasHighCholesterol || 
    hasHeartDisease || hasEarlyHeartDiseaseFamily || bmi >= 30;
  
  if (age >= lipidAgeThreshold || (age >= 20 && hasLipidRiskFactors)) {
    const status = getStatusFromLastTest(profile.lastCholesterol, 5);
    
    screenings.push({
      id: "cholesterol",
      name: "Lipid (Cholesterol) Screening",
      emoji: "🧪",
      status: profile.lastCholesterol === "never" ? "due_now" : status,
      reason: hasLipidRiskFactors
        ? `Age ${age} + risk factors (${[
            hasDiabetes && "diabetes",
            hasHypertension && "hypertension",
            hasEarlyHeartDiseaseFamily && "family history",
            bmi >= 30 && "BMI ≥30",
          ].filter(Boolean).join(", ")})`
        : `Routine screening for ${profile.sexAtBirth === "male" ? "men" : "women"} ${lipidAgeThreshold}+`,
      frequency: "Every 5 years (more often if abnormal)",
    });
  }

  // 3. Type 2 Diabetes Screening (Grade B) - Ages 35-70 with BMI ≥25
  if (age >= 35 && age <= 70 && bmi >= 25) {
    const status = getStatusFromLastTest(profile.lastDiabetesTest, 3);
    
    screenings.push({
      id: "diabetes",
      name: "Type 2 Diabetes Screening",
      emoji: "🧪",
      status,
      reason: `Age 35-70 + BMI ${bmi.toFixed(1)} (≥25 threshold)`,
      frequency: "Every 3 years",
    });
  }

  // 4. Colorectal Cancer Screening (Grade A) - Ages 45-75
  if (age >= 45 && age <= 75) {
    const hasColorectalCancerFamily = profile.familyHistory.includes("colorectal_cancer");
    const status = getStatusFromLastTest(profile.lastColonoscopy, 10);
    
    screenings.push({
      id: "colorectal",
      name: "Colorectal Cancer Screening",
      emoji: "🎗️",
      status: profile.lastColonoscopy === "never" ? "due_now" : status,
      reason: hasColorectalCancerFamily 
        ? "Age 45-75 + family history of colorectal cancer"
        : "Recommended for adults age 45-75",
      frequency: "Colonoscopy every 10 years, or FIT annually",
      options: ["Annual FIT (at-home)", "Colonoscopy every 10 years"],
    });
  }

  // 5. Breast Cancer Screening / Mammogram (Grade B) - Women 40-74
  if (profile.sexAtBirth === "female" && age >= 40 && age <= 74) {
    const hasBreastCancerFamily = profile.familyHistory.includes("breast_cancer");
    const status = getStatusFromLastTest(profile.lastMammogram, 2);
    
    screenings.push({
      id: "mammogram",
      name: "Breast Cancer Screening (Mammogram)",
      emoji: "🎗️",
      status: profile.lastMammogram === "never" ? "due_now" : status,
      reason: hasBreastCancerFamily
        ? "Age 40-74 + family history of breast cancer"
        : "Recommended for women age 40-74",
      frequency: "Every 2 years",
    });
  }

  // 6. Cervical Cancer Screening (Grade A) - Ages 21-65 with cervix
  if (hasCervix && age >= 21 && age <= 65) {
    // Pap every 3 years (21-29) or Pap + HPV every 5 years (30-65)
    const dueEvery = age >= 30 ? 5 : 3;
    const status = getStatusFromLastTest(profile.lastCervicalScreening, dueEvery);
    
    screenings.push({
      id: "cervical",
      name: "Cervical Cancer Screening",
      emoji: "🎗️",
      status,
      reason: "Recommended for individuals with cervix age 21-65",
      frequency: age >= 30 ? "Every 5 years (Pap + HPV)" : "Every 3 years (Pap only)",
    });
  }

  // 7. Lung Cancer Screening (Grade B) - Ages 50-80, 20+ pack-years, currently smoking or quit within 15 years
  if (
    age >= 50 && 
    age <= 80 && 
    packYears >= 20 && 
    (profile.smokingStatus === "current" || 
      (profile.smokingStatus === "former" && yearsQuit <= 15))
  ) {
    screenings.push({
      id: "lung_cancer",
      name: "Lung Cancer Screening (Low-dose CT)",
      emoji: "🫁",
      status: "due_now", // Annual screening
      reason: `Age 50-80 + ${packYears} pack-years smoking history${
        profile.smokingStatus === "former" ? `, quit ${yearsQuit} years ago` : ""
      }`,
      frequency: "Annually",
    });
  } else if (
    profile.smokingStatus === "former" && 
    packYears >= 20 && 
    yearsQuit > 15
  ) {
    // Not applicable - quit too long ago
    screenings.push({
      id: "lung_cancer",
      name: "Lung Cancer Screening (Low-dose CT)",
      emoji: "🫁",
      status: "not_applicable",
      reason: `Quit smoking ${yearsQuit} years ago (>15 years)`,
    });
  }

  // 8. HIV Screening (Grade A) - One-time for ages 15-65, more often if high risk
  if (age >= 15 && age <= 65) {
    const isHighRisk = profile.hivRisk || profile.stiHistory || 
      (profile.partnersLast12Months && profile.partnersLast12Months > 1);
    
    let status: ScreeningStatus;
    if (profile.lastHivTest === "never" || !profile.lastHivTest) {
      status = "due_now";
    } else if (isHighRisk) {
      status = getStatusFromLastTest(profile.lastHivTest, 1);
    } else if (profile.lastHivTest === "over_3_years") {
      status = "due_soon";
    } else {
      status = "up_to_date";
    }

    screenings.push({
      id: "hiv",
      name: "HIV Screening",
      emoji: "🦠",
      status,
      reason: isHighRisk 
        ? "Increased risk - annual screening recommended"
        : "One-time screening for adults 15-65",
      frequency: isHighRisk ? "Annually" : "One-time (or periodic based on risk)",
    });
  }

  // 9. Depression Screening (Grade B) - All adults
  if (age >= 18) {
    const status = getStatusFromLastTest(profile.lastDepressionScreening, 1);
    
    screenings.push({
      id: "depression",
      name: "Depression Screening",
      emoji: "🧠",
      status: profile.lastDepressionScreening === "never" || !profile.lastDepressionScreening 
        ? "due_now" 
        : status,
      reason: "Universal screening for adults",
      frequency: "Annually or as needed",
    });
  }

  // 10. Tobacco Cessation Counseling (Grade A) - Current smokers
  if (profile.smokingStatus === "current") {
    screenings.push({
      id: "tobacco_counseling",
      name: "Tobacco Cessation Counseling",
      emoji: "🚭",
      status: "due_now",
      reason: "Current smoker - counseling and interventions recommended",
      frequency: "Ongoing",
    });
  } else if (profile.smokingStatus === "former") {
    screenings.push({
      id: "tobacco_counseling",
      name: "Tobacco Use Counseling",
      emoji: "🚭",
      status: "due_soon",
      reason: "Former smoker - follow-up counseling recommended",
      frequency: "As needed",
    });
  }

  // 11. Unhealthy Alcohol Use Screening & Counseling (Grade B) - Adults 18+
  if (age >= 18 && (profile.alcoholFrequency === "daily" || 
    (profile.alcoholFrequency === "weekly" && (profile.drinksPerOccasion || 0) >= 4))) {
    screenings.push({
      id: "alcohol_counseling",
      name: "Alcohol Use Counseling",
      emoji: "🍷",
      status: "due_now",
      reason: "Elevated alcohol use detected - counseling recommended",
      frequency: "As needed",
    });
  }

  // 12. STI Screening (Grade B) - Sexually active individuals with risk factors
  if (profile.sexuallyActive && (
    profile.stiHistory || 
    (profile.partnersLast12Months && profile.partnersLast12Months > 1) ||
    age < 25
  )) {
    screenings.push({
      id: "sti",
      name: "STI Screening (Chlamydia, Gonorrhea, Syphilis)",
      emoji: "🔬",
      status: "due_now",
      reason: profile.stiHistory 
        ? "History of STI - screening recommended"
        : age < 25 
          ? "Sexually active under 25 - screening recommended"
          : "Multiple partners - screening recommended",
      frequency: "Annually or as indicated",
    });
  }

  // 13. Osteoporosis Screening (Grade B) - Women 65+ or postmenopausal with risk factors
  if (profile.sexAtBirth === "female" && age >= 65) {
    screenings.push({
      id: "osteoporosis",
      name: "Osteoporosis Screening (DEXA)",
      emoji: "🦴",
      status: "due_now",
      reason: "Women 65+ - bone density screening recommended",
      frequency: "As determined by provider",
    });
  }

  // 14. Abdominal Aortic Aneurysm Screening (Grade B) - Men 65-75 who have ever smoked
  if (
    profile.sexAtBirth === "male" && 
    age >= 65 && 
    age <= 75 && 
    (profile.smokingStatus === "former" || profile.smokingStatus === "current")
  ) {
    screenings.push({
      id: "aaa",
      name: "Abdominal Aortic Aneurysm Screening",
      emoji: "🫀",
      status: "due_now",
      reason: "Men 65-75 with smoking history - one-time ultrasound recommended",
      frequency: "One-time",
    });
  }

  // 15. Hepatitis C Screening (Grade B) - Adults 18-79 (one-time)
  if (age >= 18 && age <= 79) {
    screenings.push({
      id: "hepatitis_c",
      name: "Hepatitis C Screening",
      emoji: "🧪",
      status: "due_soon", // One-time, lower priority
      reason: "One-time screening for adults 18-79",
      frequency: "One-time",
    });
  }

  // 16. Hepatitis B Screening (Grade B) - Adults at increased risk
  if (profile.hivRisk || profile.stiHistory) {
    screenings.push({
      id: "hepatitis_b",
      name: "Hepatitis B Screening",
      emoji: "🧪",
      status: "due_soon",
      reason: "Increased risk - screening recommended",
      frequency: "One-time or as indicated",
    });
  }

  // Sort by status priority: due_now first, then due_soon, then up_to_date, then not_applicable
  const statusOrder: Record<ScreeningStatus, number> = {
    due_now: 0,
    due_soon: 1,
    up_to_date: 2,
    not_applicable: 3,
  };

  return screenings.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
};

/**
 * Group screenings by status
 */
export const groupScreeningsByStatus = (screenings: ScreeningItem[]) => {
  return {
    dueNow: screenings.filter((s) => s.status === "due_now"),
    dueSoon: screenings.filter((s) => s.status === "due_soon"),
    upToDate: screenings.filter((s) => s.status === "up_to_date"),
    notApplicable: screenings.filter((s) => s.status === "not_applicable"),
  };
};

