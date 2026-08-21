import { CoaStage } from '../types';

export const COA_STANDARD_STAGES: CoaStage[] = [
  {
    id: 'coa_stage_1',
    stageNumber: 1,
    name: 'Concept Design & Brief Formulation',
    shortName: 'Concept Design',
    description: 'Site study, client brief finalization, site evaluation, and preliminary conceptual sketches/layouts.',
    deliverables: [
      'Site evaluation & zoning/bylaws analysis',
      'Conceptual architectural sketches & space-relationship diagrams',
      'Preliminary area statements and massing models',
      'Initial discussion with client for design intent'
    ],
    percentageOfFee: 10
  },
  {
    id: 'coa_stage_2',
    stageNumber: 2,
    name: 'Preliminary Design & Development',
    shortName: 'Design Development',
    description: 'Developing approved concept into detailed architectural layouts, 3D visualizations, and preliminary cost estimates.',
    deliverables: [
      'Refined architectural plans, elevations, and sections',
      '3D views / digital architectural renderings',
      'Coordination with preliminary structural & MEP layouts',
      'Preliminary approximate cost estimation based on plinth area'
    ],
    percentageOfFee: 15
  },
  {
    id: 'coa_stage_3',
    stageNumber: 3,
    name: 'Statutory Approvals & Sanction Drawings',
    shortName: 'Statutory Approvals',
    description: 'Preparation of statutory drawings complying with local municipal building bylaws and assistance in submission.',
    deliverables: [
      'Municipal sanction drawings conforming to local development control regulations',
      'FSI/FAR calculations and setback plans',
      'Assistance in filing with local municipal corporation / urban development authority',
      'Revisions required to satisfy statutory authority requirements'
    ],
    percentageOfFee: 15
  },
  {
    id: 'coa_stage_4',
    stageNumber: 4,
    name: 'Working Drawings & Tender Documents',
    shortName: 'Working Drawings & Tender',
    description: 'Detailed architectural drawings, finish schedules, bill of quantities (BOQ), and tender specifications.',
    deliverables: [
      'Comprehensive architectural working drawings & construction details',
      'Integrated structural, electrical, plumbing & HVAC coordinated drawings',
      'Bill of Quantities (BOQ) and detailed specifications of materials',
      'Tender documents, conditions of contract & invitation of bids'
    ],
    percentageOfFee: 20
  },
  {
    id: 'coa_stage_5',
    stageNumber: 5,
    name: 'Appointment of Contractors & Bid Analysis',
    shortName: 'Tender Evaluation',
    description: 'Analyzing contractor tender bids, comparative statements, and awarding work.',
    deliverables: [
      'Technical and commercial evaluation of contractor tenders',
      'Comparative bid analysis report with recommendations',
      'Assistance in finalizing contract agreements with selected contractors',
      'Preparation of construction schedule milestones'
    ],
    percentageOfFee: 5
  },
  {
    id: 'coa_stage_6',
    stageNumber: 6,
    name: 'Construction Administration & Periodic Inspection',
    shortName: 'Site Supervision',
    description: 'Issuing Good-for-Construction (GFC) drawings, periodic site visits, quality checks, and contractor bill verification.',
    deliverables: [
      'Issue of Good for Construction (GFC) drawings to site',
      'Periodic site inspection visits to verify execution as per design intent',
      'Clarification of construction queries & detailing during execution',
      'Verification & certification of contractor progress bills'
    ],
    percentageOfFee: 25
  },
  {
    id: 'coa_stage_7',
    stageNumber: 7,
    name: 'Completion Certificate & As-Built Drawings',
    shortName: 'Completion & Handover',
    description: 'Final inspection, preparation of As-Built drawings, and obtaining occupancy/completion certificates.',
    deliverables: [
      'Final joint inspection of completed building works',
      'Preparation and submission of As-Built architectural drawings',
      'Assistance in obtaining Municipal Occupancy / Completion Certificate (OC/CC)',
      'Handover dossier and warranty maintenance guidelines to client'
    ],
    percentageOfFee: 10
  }
];

export const COA_PRESET_TEMPLATES = [
  {
    id: 'comprehensive_coa',
    name: 'CoA Standard Comprehensive (7 Stages)',
    description: 'Full-spectrum architectural services as prescribed by the Council of Architecture, India.',
    recommendedPercentageRate: 5.0,
    stages: COA_STANDARD_STAGES
  },
  {
    id: 'residential_villa',
    name: 'Residential Villa / Bungalow (6 Stages)',
    description: 'Tailored for private bespoke residences, bungalows, and farmhouses.',
    recommendedPercentageRate: 6.5,
    stages: [
      {
        id: 'res_stage_1',
        stageNumber: 1,
        name: 'Concept & Lifestyle Briefing',
        shortName: 'Concept Design',
        description: 'Vastu/orientation analysis, spatial program, and conceptual layouts.',
        deliverables: ['Spatial layout plans', 'Concept mood boards & sketches', 'Site zoning & Vastu orientation analysis'],
        percentageOfFee: 15
      },
      {
        id: 'res_stage_2',
        stageNumber: 2,
        name: 'Schematic Design & 3D Visualization',
        shortName: '3D & Schemes',
        description: 'Façade design, photorealistic 3D exterior renders, and material selection.',
        deliverables: ['High-res 3D exterior renders', 'Detailed architectural floor plans & elevations', 'Material palette & finishes specification'],
        percentageOfFee: 20
      },
      {
        id: 'res_stage_3',
        stageNumber: 3,
        name: 'Municipal Sanction Drawings',
        shortName: 'Sanction Approval',
        description: 'Statutory approvals and sanction drawings according to municipal bylaws.',
        deliverables: ['Sanction drawing set', 'Bylaw compliance calculations', 'Liaison support for municipal approval'],
        percentageOfFee: 15
      },
      {
        id: 'res_stage_4',
        stageNumber: 4,
        name: 'Working Drawings & BOQ',
        shortName: 'Working Drawings',
        description: 'Execution drawings for civil, plumbing, electrical, doors/windows, and detailed BOQ.',
        deliverables: ['Civil working drawings set', 'Electrical, plumbing & drainage schematics', 'Door/Window schedules & joinery details', 'Detailed itemized BOQ'],
        percentageOfFee: 25
      },
      {
        id: 'res_stage_5',
        stageNumber: 5,
        name: 'Site Execution Supervision',
        shortName: 'Site Supervision',
        description: 'Periodic site visits during key structural and finishing milestones.',
        deliverables: ['Periodic site inspection visits', 'Quality checks & snag listings', 'Verification of contractor measurement sheets'],
        percentageOfFee: 15
      },
      {
        id: 'res_stage_6',
        stageNumber: 6,
        name: 'Completion & Handover',
        shortName: 'Handover',
        description: 'Final snagging, as-built set, and occupancy clearance.',
        deliverables: ['As-built drawings archive', 'Final walkthrough and handover sign-off'],
        percentageOfFee: 10
      }
    ]
  },
  {
    id: 'interior_architecture',
    name: 'Interior Architectural Services (CoA Model)',
    description: 'Turnkey or design consultancy for interior architecture, space planning, and millwork detailing.',
    recommendedPercentageRate: 10.0,
    stages: [
      {
        id: 'int_stage_1',
        stageNumber: 1,
        name: 'Space Planning & Concept Mood Boards',
        shortName: 'Concept & Space Plan',
        description: 'Detailed measurement, space layout options, and thematic mood boards.',
        deliverables: ['Furniture layout options', 'Material and thematic mood boards', 'Preliminary interior estimate'],
        percentageOfFee: 20
      },
      {
        id: 'int_stage_2',
        stageNumber: 2,
        name: '3D Photorealistic Interior Views',
        shortName: '3D Visualization',
        description: '3D perspectives of all key zones (Living, Master Bedroom, Kitchen, etc.).',
        deliverables: ['Photo-real 3D renders of all primary spaces', 'Color palette and lighting layout schemes'],
        percentageOfFee: 25
      },
      {
        id: 'int_stage_3',
        stageNumber: 3,
        name: 'Detailed Interior Working Drawings & BOQ',
        shortName: 'Millwork & Details',
        description: 'False ceiling, electrical/lighting, plumbing, flooring, joinery & modular carpentry drawings.',
        deliverables: ['Reflected ceiling plans (RCP) & lighting loops', 'Modular kitchen & wardrobe fabrication drawings', 'Flooring & wall cladding layouts', 'Detailed interior BOQ with material codes'],
        percentageOfFee: 30
      },
      {
        id: 'int_stage_4',
        stageNumber: 4,
        name: 'Site Execution & Material Selection Visits',
        shortName: 'Execution & Styling',
        description: 'Vendor selection visits, site supervision, and soft furnishing guidance.',
        deliverables: ['Material selection & vendor market visits', 'Site inspection during carpentry and painting', 'Snag rectification list'],
        percentageOfFee: 15
      },
      {
        id: 'int_stage_5',
        stageNumber: 5,
        name: 'Final Styling & Handover',
        shortName: 'Handover',
        description: 'Decor styling, hardware snag verification, and project handover.',
        deliverables: ['Final handover inspection', 'Defects liability walkthrough'],
        percentageOfFee: 10
      }
    ]
  }
];

export const COA_STANDARD_CLAUSES = [
  'The Architect shall provide services in accordance with the Council of Architecture (CoA) Professional Conduct Regulations.',
  'Scale of fees and milestone disbursements are aligned with the progress of drawings and execution stages.',
  'Statutory application fees, government scrutiny fees, and third-party consultant fees (Structural, MEP, Landscape) if billed directly shall be borne directly by the Client.',
  'Site visits included in the scope: Up to 15 periodic supervisory visits for the project duration. Additional visits requested beyond this scope shall be charged at mutually agreed per-visit rates.',
  'All architectural drawings, 3D renderings, and specifications prepared by the Architect remain the intellectual property and copyright of the Architect under CoA norms.',
  'Payment Terms: Invoices raised upon completion of each stage are payable within 15 business days. Interest @ 18% p.a. will be applicable on delayed payments.',
  'Any major revision in approved conceptual designs or approved sanction plans due to client brief change shall be treated as an additional service and billed proportionally.'
];

export const SAC_CODES_DIRECTORY = [
  { code: '998321', description: 'Architectural and landscape architectural services' },
  { code: '998322', description: 'Interior architectural and design services' },
  { code: '998323', description: 'Urban planning and landscape architectural design services' },
  { code: '998324', description: 'Engineering and structural coordination services' },
  { code: '998329', description: 'Other architectural & technical advisory services' }
];

export const INDIAN_STATES_AND_CODES = [
  { code: '01', name: 'Jammu & Kashmir' },
  { code: '02', name: 'Himachal Pradesh' },
  { code: '03', name: 'Punjab' },
  { code: '04', name: 'Chandigarh' },
  { code: '06', name: 'Haryana' },
  { code: '07', name: 'Delhi' },
  { code: '08', name: 'Rajasthan' },
  { code: '09', name: 'Uttar Pradesh' },
  { code: '10', name: 'Bihar' },
  { code: '19', name: 'West Bengal' },
  { code: '21', name: 'Odisha' },
  { code: '23', name: 'Madhya Pradesh' },
  { code: '24', name: 'Gujarat' },
  { code: '27', name: 'Maharashtra' },
  { code: '29', name: 'Karnataka' },
  { code: '30', name: 'Goa' },
  { code: '32', name: 'Kerala' },
  { code: '33', name: 'Tamil Nadu' },
  { code: '36', name: 'Telangana' },
  { code: '37', name: 'Andhra Pradesh' }
];
