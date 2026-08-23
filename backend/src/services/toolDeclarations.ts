// Declare the provider tools GeoBot may call; implementations live separately from model-facing schemas.
export const earthquakeTools = {
  functionDeclarations: [
    {
      name: 'getLatestEarthquakes',
      description: 'Retrieves a summary of the latest earthquakes recorded in the system, optionally filtered by magnitude.',
      parameters: {
        type: 'OBJECT',
        properties: {
          minMagnitude: { type: 'NUMBER', description: 'Minimum magnitude filter (e.g. 5.0)' },
          limit: { type: 'INTEGER', description: 'Number of earthquakes to return (default 5)' }
        }
      }
    },
    {
      name: 'getSafetyGuide',
      description: 'Retrieves emergency preparedness safety instructions for earthquakes (before, during, or after).',
      parameters: {
        type: 'OBJECT',
        properties: {
          phase: {
            type: 'STRING',
            enum: ['before', 'during', 'after', 'all'],
            description: 'The phase of safety guidelines: before, during, or after an earthquake.'
          }
        },
        required: ['phase']
      }
    },
    {
      name: 'getDashboardStatistics',
      description: 'Retrieves key metrics and statistics from the dashboard, including total count, average magnitude, and max magnitude.',
      parameters: {
        type: 'OBJECT',
        properties: {}
      }
    }
  ]
};
