export const getJwtSecret = (): string => {
  return process.env.JWT_SECRET || "geopulse_dev_secret_phrase_99118822";
};
