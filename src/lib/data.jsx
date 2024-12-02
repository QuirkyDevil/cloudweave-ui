export const MODEL_DATA = {
  DAIN: {
    publisher: 'MIT Computer Science and Artificial Intelligence Laboratory',
    yearPublished: 2019,
    architecture: 'Deep Adaptive Input Interpolation Network',
    primaryTechnique: 'Adaptive Interpolation with Optical Flow',
    description:
      'An advanced deep learning approach for cloud motion and density interpolation.',
    advantages: [
      'Adaptive interpolation handles complex cloud formations',
      'High accuracy in tracking cloud movement',
      'Effective for temporal gaps in satellite imagery',
      'Low computational overhead compared to traditional methods',
    ],
    disadvantages: [
      'Limited performance in rapid cloud transformation scenarios',
      'Potential loss of fine-detail cloud texture',
      'Requires extensive training on diverse cloud datasets',
      'May struggle with extreme atmospheric conditions',
    ],
    idealUseCases: [
      'Meteorological forecasting',
      'Climate change monitoring',
      'Satellite image reconstruction',
      'WMS cloud layer visualization',
    ],
    githubLink: 'https://github.com/fyruonn/DAIN',
  },
  FILM: {
    publisher: 'Google Research',
    yearPublished: 2022,
    architecture: 'Frame Interpolation for Large Motion',
    primaryTechnique: 'Large Motion Interpolation',
    description:
      'Advanced AI model for handling significant cloud motion and transformation.',
    advantages: [
      'Excellent handling of large-scale cloud movements',
      'Superior performance in dynamic atmospheric conditions',
      'High-resolution cloud layer reconstruction',
      'Robust against temporal discontinuities',
    ],
    disadvantages: [
      'Higher computational complexity',
      'Increased GPU memory requirements',
      'Potential over-smoothing of cloud boundaries',
      'Less effective in sparse data scenarios',
    ],
    idealUseCases: [
      'Real-time weather monitoring',
      'Dynamic WMS cloud layer generation',
      'Climate research visualization',
      'Severe weather prediction',
    ],
    githubLink: 'https://github.com/google-research/frame-interpolation',
  },
  RIFE: {
    publisher: 'Bytedance AI Lab',
    yearPublished: 2020,
    architecture: 'Real-Time Intermediate Flow Estimation',
    primaryTechnique: 'Real-time Intermediate Flow Estimation',
    description: 'Lightweight AI model for rapid cloud motion interpolation.',
    advantages: [
      'Real-time cloud motion estimation',
      'Minimal computational overhead',
      'Efficient for edge and mobile computing',
      'Quick cloud layer updates',
    ],
    disadvantages: [
      'Reduced accuracy in complex cloud formations',
      'Limited temporal resolution',
      'Potential loss of intricate cloud details',
      'Less reliable in extreme weather conditions',
    ],
    idealUseCases: [
      'Mobile weather applications',
      'Quick WMS cloud layer updates',
      'Low-resource cloud tracking',
      'Preliminary cloud motion analysis',
    ],
    githubLink: 'https://github.com/megvii-research/RIFE',
  },
  RAFT: {
    publisher: 'Google Research',
    yearPublished: 2019,
    architecture: 'Recurrent All-Pairs Field Transforms',
    primaryTechnique: 'Iterative Flow Matching',
    description:
      'Robust AI model for comprehensive cloud motion analysis and interpolation.',
    advantages: [
      'Comprehensive cloud motion tracking',
      'High accuracy in flow estimation',
      'Effective across various cloud densities',
      'Robust iterative matching algorithm',
    ],
    disadvantages: [
      'Complex implementation',
      'Higher training data requirements',
      'Increased computational complexity',
      'Potential performance variability',
    ],
    idealUseCases: [
      'Advanced meteorological research',
      'Detailed WMS cloud layer overlay',
      'Climate modeling',
      'Comprehensive atmospheric studies',
    ],
    githubLink:
      'https://github.com/google-research/scenic/tree/main/scenic/projects/raft',
  },
};

// Existing helper functions remain the same
export const getModelPublisher = (model) =>
  MODEL_DATA[model]?.publisher || 'Unknown';
export const getModelYear = (model) =>
  MODEL_DATA[model]?.yearPublished || 'N/A';
export const getModelArchitecture = (model) =>
  MODEL_DATA[model]?.architecture || 'Neural Network';
export const getModelTechnique = (model) =>
  MODEL_DATA[model]?.primaryTechnique || 'Frame Interpolation';
export const getModelDescription = (model) =>
  MODEL_DATA[model]?.description || 'No description available';
export const getModelGitHubLink = (model) =>
  MODEL_DATA[model]?.githubLink || '#';

// New helper functions to get advantages and disadvantages
export const getModelAdvantages = (model) =>
  MODEL_DATA[model]?.advantages || [];
export const getModelDisadvantages = (model) =>
  MODEL_DATA[model]?.disadvantages || [];
export const getIdealUseCases = (model) =>
  MODEL_DATA[model]?.idealUseCases || [];
