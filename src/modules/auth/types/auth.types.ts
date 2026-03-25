import { z } from "zod";

import { registerDTO, loginDTO } from "../dto/auth.dto.js";

export type RegisterDTO = z.infer<typeof registerDTO>;
export type LoginDTO = z.infer<typeof loginDTO>;
