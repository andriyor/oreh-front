import wretch from "wretch"
import QueryStringAddon from "wretch/addons/queryString"

export const GraphApi  = wretch('http://localhost:3000').addon(QueryStringAddon);
