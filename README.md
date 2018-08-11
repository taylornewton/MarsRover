# Mars Rover Photo of the Day
Use `npm start` to run, then access in browser at http://localhost:8080

## Automated Tests
Run `npm test` to execute unit tests

## Analysis
Application will run in O(NM), where N is the number of dates requested and M is the number of photos returned per date.

## Next Steps
UX Improvements
- Allow users to enter/select dates
- Allow users to select Rover and Camera(s)
- Display all results, then allow users to select which photos they would like to download

A few ideas of how to improve the performance of this application moving forward:
- Begin processing results from each date as soon as each call returns from the API, instead of waiting until all responses return. (Refactoring web application to load each day progessively as it is complete.)
- Leverage service workers to cache responses from API
- Use a db to store data for photos based on id and date