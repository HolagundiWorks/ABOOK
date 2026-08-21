import { FreelanceTemplate } from '../types';

export const INITIAL_FREELANCE_TEMPLATES: FreelanceTemplate[] = [
  {
    id: 'tpl_3d_renders',
    title: '3D Visualization & Exterior Renders',
    category: '3D Visualization',
    description: 'Photorealistic 3D architectural perspectives, day/night lighting, high-res materials for presentation.',
    lumpSumRate: 15000,
    sacCode: '998321',
    items: [
      {
        id: 'item_3d_1',
        name: '3D Exterior Front Elevation (Day & Twilight View)',
        deliverables: '2 photorealistic 4K exterior renders with landscape context',
        percentage: 60,
        amount: 9000,
        sacCode: '998321'
      },
      {
        id: 'item_3d_2',
        name: '3D Interior Perspectives (Living & Master Bedroom)',
        deliverables: '2 interior 3D renders with lighting and furniture layout',
        percentage: 40,
        amount: 6000,
        sacCode: '998322'
      }
    ]
  },
  {
    id: 'tpl_sanction_drawings',
    title: 'Municipal Sanction Drawing & Liaison',
    category: 'Statutory Approvals',
    description: 'Preparation of municipal sanction drawing sets conforming to local development control regulations and liaison support.',
    lumpSumRate: 35000,
    sacCode: '998321',
    items: [
      {
        id: 'item_sanc_1',
        name: 'Municipal Sanction Drawing Set Preparation',
        deliverables: 'Floor plans, elevations, sections, site plan, FSI/FAR statements as per bylaws',
        percentage: 50,
        amount: 17500,
        sacCode: '998321'
      },
      {
        id: 'item_sanc_2',
        name: 'Scrutiny Corrections & Municipal Submission Support',
        deliverables: 'Incorporating municipal engineer remarks, revision sets & submission coordination',
        percentage: 50,
        amount: 17500,
        sacCode: '998321'
      }
    ]
  },
  {
    id: 'tpl_working_drawings',
    title: 'Execution Working Drawings Package',
    category: 'Drafting & Working Drawings',
    description: 'Full set of GFC (Good for Construction) architectural working drawings for on-site execution.',
    lumpSumRate: 45000,
    sacCode: '998321',
    items: [
      {
        id: 'item_wd_1',
        name: 'Civil & Masonry Setting-Out Drawings',
        deliverables: 'Dimensioned center-line plan, foundation layout, column marking & masonry plans',
        percentage: 35,
        amount: 15750,
        sacCode: '998321'
      },
      {
        id: 'item_wd_2',
        name: 'Integrated Electrical & Plumbing Schematics',
        deliverables: 'Lighting loops, switchboard locations, conduit pathways, water supply & drainage lines',
        percentage: 35,
        amount: 15750,
        sacCode: '998321'
      },
      {
        id: 'item_wd_3',
        name: 'Door/Window Schedule & Joinery Details',
        deliverables: 'Detailed fabrication drawings for openings, railing details & kitchen counter sections',
        percentage: 30,
        amount: 13500,
        sacCode: '998321'
      }
    ]
  },
  {
    id: 'tpl_interior_concept',
    title: 'Interior Concept & Space Planning Pack',
    category: 'Interior Architecture',
    description: 'Turnkey interior concept, functional furniture zoning, mood boards, and material selection guide.',
    lumpSumRate: 25000,
    sacCode: '998322',
    items: [
      {
        id: 'item_int_1',
        name: 'Space Planning & Furniture Layout Options',
        deliverables: '2 spatial layout variations with circulation clearances and zoning',
        percentage: 40,
        amount: 10000,
        sacCode: '998322'
      },
      {
        id: 'item_int_2',
        name: 'Concept Moodboards & Material Palette Selection',
        deliverables: 'Curated moodboards, paint codes, laminate/veneer codes & lighting fixtures list',
        percentage: 60,
        amount: 15000,
        sacCode: '998322'
      }
    ]
  },
  {
    id: 'tpl_site_visits',
    title: 'Site Supervision & Inspection (Pack of 3 Visits)',
    category: 'Site Supervision',
    description: 'Expert architectural site inspection visits to verify alignment with approved designs and quality checks.',
    lumpSumRate: 10000,
    sacCode: '998329',
    items: [
      {
        id: 'item_sv_1',
        name: 'Visit 1: Plinth / Column Footing Alignment Verification',
        deliverables: 'On-site measurement inspection & verification report',
        percentage: 33.33,
        amount: 3333,
        sacCode: '998329'
      },
      {
        id: 'item_sv_2',
        name: 'Visit 2: RCC Slab Shuttering & Rebar Pre-Pour Inspection',
        deliverables: 'Conduit placement and reinforcement check before slab casting',
        percentage: 33.33,
        amount: 3333,
        sacCode: '998329'
      },
      {
        id: 'item_sv_3',
        name: 'Visit 3: Finishing & Snagging Inspection Report',
        deliverables: 'Itemized snag list for plaster, flooring, and joinery defects rectification',
        percentage: 33.34,
        amount: 3334,
        sacCode: '998329'
      }
    ]
  },
  {
    id: 'tpl_boq_tender',
    title: 'BOQ & Contractor Tender Documentation',
    category: 'Estimation & BOQ',
    description: 'Detailed bill of quantities, itemized rate analysis, technical specifications, and contractor tender draft.',
    lumpSumRate: 18000,
    sacCode: '998329',
    items: [
      {
        id: 'item_boq_1',
        name: 'Civil & Finishing Bill of Quantities (BOQ)',
        deliverables: 'Spreadsheet itemizing concrete, masonry, plaster, flooring, painting & hardware',
        percentage: 60,
        amount: 10800,
        sacCode: '998329'
      },
      {
        id: 'item_boq_2',
        name: 'Tender Specifications & Contract Draft',
        deliverables: 'Conditions of contract, payment milestone schedule & bidder guidelines',
        percentage: 40,
        amount: 7200,
        sacCode: '998329'
      }
    ]
  },
  {
    id: 'tpl_as_built',
    title: 'As-Built CAD Documentation & Survey',
    category: 'Drafting & Survey',
    description: 'Physical site measurement of completed building and generation of exact As-Built 2D CAD drawings.',
    lumpSumRate: 12000,
    sacCode: '998329',
    items: [
      {
        id: 'item_asb_1',
        name: 'On-Site Laser Distance Measure Survey',
        deliverables: 'Field measurement sketches and photographic documentation',
        percentage: 40,
        amount: 4800,
        sacCode: '998329'
      },
      {
        id: 'item_asb_2',
        name: 'As-Built 2D CAD Plans & PDF Archive',
        deliverables: 'Clean layered DWG/CAD files and consolidated PDF as-built drawing sheet set',
        percentage: 60,
        amount: 7200,
        sacCode: '998329'
      }
    ]
  }
];
