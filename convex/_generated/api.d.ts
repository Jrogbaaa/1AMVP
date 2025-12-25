/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as authHelpers from "../authHelpers.js";
import type * as chat from "../chat.js";
import type * as doctorProfiles from "../doctorProfiles.js";
import type * as feed from "../feed.js";
import type * as generatedVideos from "../generatedVideos.js";
import type * as http from "../http.js";
import type * as preventiveCare from "../preventiveCare.js";
import type * as users from "../users.js";
import type * as videoEngagement from "../videoEngagement.js";
import type * as videoGenerationJobs from "../videoGenerationJobs.js";
import type * as videoTemplates from "../videoTemplates.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  authHelpers: typeof authHelpers;
  chat: typeof chat;
  doctorProfiles: typeof doctorProfiles;
  feed: typeof feed;
  generatedVideos: typeof generatedVideos;
  http: typeof http;
  preventiveCare: typeof preventiveCare;
  users: typeof users;
  videoEngagement: typeof videoEngagement;
  videoGenerationJobs: typeof videoGenerationJobs;
  videoTemplates: typeof videoTemplates;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
