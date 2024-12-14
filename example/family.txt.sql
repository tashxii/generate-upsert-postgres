INSERT INTO "family" ("familyID", "familyName") 
  VALUES (1, '磯野')
  ON CONFLICT ("familyID")
  DO UPDATE SET "familyID" = 1, "familyName" = '磯野';
INSERT INTO "family" ("familyID", "familyName") 
  VALUES (2, '伊佐坂')
  ON CONFLICT ("familyID")
  DO UPDATE SET "familyID" = 2, "familyName" = '伊佐坂';