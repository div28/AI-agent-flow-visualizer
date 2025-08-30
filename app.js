const { useState, useEffect, useRef } = React;

// Enterprise scenarios with detailed context
const enterpriseScenarios = {
  atlassian: {
    company: 'Atlassian',
    logo: '🔷',
    color: '#0052CC',
    scenario: 'DevOps Deployment Pipeline Failure',
    problem: 'Production deployment agent bypassed critical integration tests',
    business_context: {
      scale: '10,000+ daily deployments',
      criticality: 'Mission-critical infrastructure',
      team_size: '250+ developers',
      cost_per_incident: '$127,000'
    },
    stakeholders: ['DevOps Engineers', 'Site Reliability Team', 'Product Engineering'],
    technical_context: {
      architecture: 'Microservices with automated CI/CD',
      agent_role: 'Deployment decision orchestrator',
      integration_points: ['GitHub', 'Jenkins', 'Kubernetes', 'DataDog']
    },
    impact: {
      revenue_loss: 127000,
      downtime_minutes: 360,
      customers_affected: 15000,
      sla_violations: 3,
      developer_hours_lost: 45
    },
    agent_flow: [
      {
        step: 1,
        title: 'Code Analysis',
        description: 'Agent performs static analysis on database migration files to identify syntax and structural issues.',
        context: 'This is the first checkpoint in our deployment pipeline. The agent scans all changed files to ensure basic quality standards.',
        tool: 'code_analyzer_v2',
        input: 'database_migration.sql (47 lines, 3 tables affected)',
        decision_logic: 'IF syntax_valid AND no_reserved_keywords THEN proceed',
        output: '✅ Syntax validation passed - No structural issues detected',
        status: 'success',
        duration: 245,
        confidence: 99,
        business_impact: 'Standard validation - prevents basic deployment failures',
        next_step: 'Proceed to security scanning'
      },
      {
        step: 2,
        title: 'Security Vulnerability Assessment',
        description: 'Agent runs comprehensive security scans across the entire codebase to identify potential vulnerabilities.',
        context: 'Security is paramount for Atlassian. This step ensures no known vulnerabilities are introduced.',
        tool: 'security_scanner_enterprise',
        input: 'full_codebase (12,847 files, 2.3M LOC)',
        decision_logic: 'IF vulnerability_score < threshold AND no_critical_issues THEN proceed',
        output: '✅ Security assessment complete - 0 critical, 2 low-severity findings',
        status: 'success',
        duration: 1200,
        confidence: 95,
        business_impact: 'Prevents security incidents - estimated $2M+ in breach costs avoided',
        next_step: 'Evaluate testing requirements'
      },
      {
        step: 3,
        title: 'Integration Test Decision Point',
        description: 'CRITICAL FAILURE: Agent must determine if integration tests are required for this deployment.',
        context: 'This is where the failure occurred. The agent failed to recognize that database schema changes ALWAYS require integration testing.',
        tool: 'test_orchestrator_v3',
        input: 'change_analysis: {database_schema: true, api_changes: false, ui_changes: false}',
        decision_logic: 'BROKEN: IF file_count < 50 THEN skip_tests (WRONG LOGIC)',
        correct_logic: 'SHOULD BE: IF database_schema_changes THEN run_integration_tests = MANDATORY',
        output: '⚠️ Integration tests marked as optional - SKIPPING due to "low risk classification"',
        status: 'failure',
        duration: 0,
        confidence: 0,
        reasoning: 'Agent used generic file count heuristic instead of change type analysis',
        business_impact: 'This decision directly caused production failure - $127K impact',
        root_cause: 'Missing conditional logic for database change detection',
        what_went_wrong: 'Agent classified database schema changes as "low risk" based on file count rather than change type',
        next_step: 'Should have run integration tests - instead proceeded to deployment'
      },
      {
        step: 4,
        title: 'Production Deployment Execution',
        description: 'Agent proceeds with deployment to production environment without proper testing validation.',
        context: 'Without integration tests, the deployment proceeded with unvalidated database changes.',
        tool: 'deployment_engine_k8s',
        input: 'deployment_target: production, tests_passed: false, override: auto',
        decision_logic: 'IF previous_steps_green THEN deploy',
        output: '❌ Database connection pool exhausted - Emergency rollback initiated',
        status: 'failure',
        duration: 30000,
        confidence: 0,
        business_impact: '6 hours downtime, 15K customers affected, emergency response team activated',
        incident_response: 'Automatic rollback triggered, incident commander notified',
        next_step: 'Post-mortem and root cause analysis'
      }
    ],
    fix_recommendation: {
      immediate: 'Add mandatory integration test checkpoint for database schema changes',
      technical: 'Update decision logic: IF (database_changes || schema_migration) THEN integration_tests = REQUIRED',
      process: 'Implement change type detection before test orchestration',
      monitoring: 'Add alerting for test skips on database changes'
    },
    prevention_confidence: 96
  },
  stripe: {
    company: 'Stripe',
    logo: '💳',
    color: '#635BFF',
    scenario: 'Multi-Agent Fraud Detection Conflict',
    problem: 'Payment processing agents returned conflicting fraud scores',
    business_context: {
      scale: '$640B+ annual processing volume',
      criticality: 'Real-time payment decisions',
      transaction_volume: '1M+ per hour',
      false_positive_cost: '$50K per incident'
    },
    stakeholders: ['Risk Operations', 'Merchant Relations', 'Payment Engineering'],
    technical_context: {
      architecture: 'Distributed agent network with real-time ML',
      agent_role: 'Multi-layer fraud detection and prevention',
      integration_points: ['Risk Engine', 'ML Models', 'Decision API', 'Merchant Dashboard']
    },
    impact: {
      transaction_blocked: 50000,
      merchant_escalation: true,
      false_positive_rate: 12,
      processing_delay: 5000,
      reputation_impact: 'High'
    },
    agent_flow: [
      {
        step: 1,
        title: 'Transaction Velocity Analysis',
        description: 'Agent analyzes transaction frequency and amount patterns against historical merchant behavior.',
        context: 'First line of defense - checks if transaction fits merchant\'s normal patterns.',
        tool: 'velocity_analyzer_ml',
        input: 'merchant_vip_001: $50K transaction, 24h history: 3 txns avg $45K',
        decision_logic: 'IF velocity_score < 0.3 AND amount_within_range THEN low_risk',
        output: '✅ Velocity analysis: LOW RISK (score: 0.15) - Pattern matches historical behavior',
        status: 'success',
        duration: 120,
        confidence: 89,
        business_impact: 'Normal transaction pattern - strong indicator of legitimacy',
        next_step: 'Proceed to device analysis'
      },
      {
        step: 2,
        title: 'Device & Location Intelligence',
        description: 'Agent performs deep device fingerprinting and geographic risk assessment.',
        context: 'Second validation layer - ensures transaction originates from known, trusted sources.',
        tool: 'device_intelligence_v4',
        input: 'device_fp: known_device_001, location: San Francisco CA, IP: trusted_range',
        decision_logic: 'IF device_known AND location_expected THEN low_risk',
        output: '✅ Device verification: LOW RISK (score: 0.12) - Known device from expected location',
        status: 'success',
        duration: 80,
        confidence: 94,
        business_impact: 'Trusted device and location - reduces fraud probability by 85%',
        next_step: 'Coordinate with other agents for final decision'
      },
      {
        step: 3,
        title: 'Multi-Agent Decision Coordination',
        description: 'CRITICAL FAILURE: System must reconcile conflicting risk scores from multiple specialized agents.',
        context: 'This is where the system failed. Multiple agents provided different risk assessments with no coordination mechanism.',
        tool: 'agent_orchestrator_v2',
        input: 'agent_scores: [velocity: 0.15, device: 0.12, behavioral: 0.87, merchant: 0.23]',
        decision_logic: 'BROKEN: IF any_agent_score > 0.8 THEN block_transaction (too simplistic)',
        correct_logic: 'SHOULD BE: weighted_consensus = Σ(agent_score × confidence × weight)',
        output: '❌ TRANSACTION BLOCKED - Conflicting agent scores (0.15 vs 0.87) - No consensus protocol',
        status: 'failure',
        duration: 5000,
        confidence: 0,
        reasoning: 'Behavioral agent flagged unusual purchase category, overrode other low-risk signals',
        business_impact: 'Legitimate $50K transaction blocked - VIP merchant escalation required',
        root_cause: 'No weighted consensus mechanism for conflicting agent decisions',
        what_went_wrong: 'Single high-confidence agent overruled multiple low-risk signals',
        correct_decision: 'Weighted score: (0.15×0.89×0.3) + (0.12×0.94×0.3) + (0.87×0.76×0.2) + (0.23×0.91×0.2) = 0.31 → APPROVE'
      }
    ],
    fix_recommendation: {
      immediate: 'Implement weighted consensus algorithm for multi-agent decisions',
      technical: 'Deploy confidence-weighted voting: final_score = Σ(agent_score × confidence × domain_weight)',
      process: 'Add agent coordination layer with conflict resolution protocols',
      monitoring: 'Track agent agreement rates and flag coordination failures'
    },
    prevention_confidence: 91
  },
  github: {
    company: 'GitHub',
    logo: '🐙',
    color: '#24292e',
    scenario: 'Security Review Agent False Negative',
    problem: 'Code review agent approved PR with hardcoded production secrets',
    business_context: {
      scale: '100M+ repositories protected',
      criticality: 'Developer security gatekeeper',
      daily_prs: '500K+ pull requests',
      security_incident_cost: '$1.2M average'
    },
    stakeholders: ['Security Engineering', 'Developer Experience', 'Compliance Team'],
    technical_context: {
      architecture: 'GitHub Apps with ML-powered security scanning',
      agent_role: 'Automated security review and approval',
      integration_points: ['GitHub API', 'Secret Detection', 'Policy Engine', 'Developer Notifications']
    },
    impact: {
      secrets_exposed: 3,
      repositories_affected: 12,
      security_incident: true,
      compliance_violation: true,
      remediation_hours: 18
    },
    agent_flow: [
      {
        step: 1,
        title: 'Secret Pattern Detection',
        description: 'Agent scans all PR files using regex patterns to identify potential hardcoded secrets and API keys.',
        context: 'First security checkpoint - identifies potential secrets using pattern matching.',
        tool: 'secret_scanner_enterprise',
        input: 'pr_files: 14 changed files, scanning for: API_KEY, SECRET, TOKEN, PASSWORD patterns',
        decision_logic: 'IF secret_pattern_found THEN flag_for_validation',
        output: '✅ Pattern detection complete - Found 3 potential secrets: [sk_live_..., pk_test_..., api_key_example]',
        status: 'success',
        duration: 180,
        confidence: 97,
        business_impact: 'Successfully identified potential security risks for further analysis',
        next_step: 'Validate whether detected patterns are real secrets'
      },
      {
        step: 2,
        title: 'Secret Context Validation',
        description: 'CRITICAL FAILURE: Agent should validate whether detected patterns are real secrets vs test/dummy values.',
        context: 'This is the critical failure point. The agent found secrets but failed to validate their authenticity.',
        tool: 'context_validator_v3',
        input: 'detected_secrets: ["sk_live_1234...", "pk_test_5678...", "api_key_example"]',
        decision_logic: 'BROKEN: assumed all detected patterns are violations (no validation logic)',
        correct_logic: 'SHOULD BE: IF secret_format_real AND not_in_test_context THEN flag_as_violation',
        output: '⚠️ Context validation BYPASSED - All patterns assumed to be violations',
        status: 'failure',
        duration: 0,
        confidence: 0,
        reasoning: 'Agent lacks logic to distinguish real secrets from test/example values',
        business_impact: 'Failed to identify that "sk_live_" prefix indicates production secret',
        root_cause: 'Missing secret validation and context analysis capabilities',
        what_went_wrong: 'Agent treated test keys ("pk_test_") and examples ("api_key_example") same as live keys',
        correct_analysis: 'sk_live_* = PRODUCTION SECRET (BLOCK), pk_test_* = TEST KEY (ALLOW), api_key_example = DUMMY (ALLOW)'
      },
      {
        step: 3,
        title: 'PR Approval Decision',
        description: 'Agent makes final approval decision based on incomplete security analysis.',
        context: 'Final checkpoint failed due to incomplete validation from previous step.',
        tool: 'pr_approval_engine',
        input: 'security_scan: {secrets_detected: true, validation_status: incomplete, false_positive_likely: assumed}',
        decision_logic: 'IF security_inconclusive THEN assume_false_positive (dangerous default)',
        output: '❌ PR APPROVED with production secret exposed - Assumed false positive without validation',
        status: 'failure',
        duration: 50,
        confidence: 0,
        business_impact: 'Production API key exposed to public repository - immediate security incident',
        incident_impact: 'API key compromised within 2 hours, emergency revocation required',
        next_step: 'Security incident response and key rotation'
      }
    ],
    fix_recommendation: {
      immediate: 'Implement context-aware secret validation before approval',
      technical: 'Add secret format analysis: validate_secret_authenticity(pattern, context, file_path)',
      process: 'Require manual review for any detected secret patterns',
      monitoring: 'Alert security team for all secret pattern detections'
    },
    prevention_confidence: 94
  },
  airbnb: {
    company: 'Airbnb',
    logo: '🏠',
    color: '#FF5A5F',
    scenario: 'Customer Service Escalation Logic Failure',
    problem: 'Support agent missed VIP guest escalation protocol',
    business_context: {
      scale: '4M+ annual bookings processed',
      criticality: 'Guest experience and retention',
      support_volume: '50K+ daily interactions',
      vip_ltv: '$47,000 average'
    },
    stakeholders: ['Customer Experience', 'VIP Relations', 'Revenue Operations'],
    technical_context: {
      architecture: 'Omnichannel support with AI triage and routing',
      agent_role: 'Automated customer service and escalation',
      integration_points: ['Booking System', 'Customer CRM', 'Payment Platform', 'Host Network']
    },
    impact: {
      guest_lifetime_value_lost: 47000,
      booking_value: 8500,
      vip_status_downgrade: true,
      negative_review: true,
      brand_reputation_impact: 'Significant'
    },
    agent_flow: [
      {
        step: 1,
        title: 'Cancellation Request Intake',
        description: 'Agent processes incoming cancellation request and validates booking details.',
        context: 'Standard first step - agent receives and validates the cancellation request.',
        tool: 'booking_management_system',
        input: 'booking_BK789456: {guest: premium_001, value: $8,500, checkin: 7_days, property: luxury_villa}',
        decision_logic: 'IF booking_valid AND within_cancellation_window THEN process_request',
        output: '✅ Cancellation request validated - Booking confirmed, guest verified, timing acceptable',
        status: 'success',
        duration: 340,
        confidence: 99,
        business_impact: 'Standard processing - request meets all technical requirements',
        next_step: 'Apply appropriate cancellation policy'
      },
      {
        step: 2,
        title: 'Cancellation Policy Application',
        description: 'Agent determines applicable cancellation policy and calculates refund amount.',
        context: 'Policy engine applies standard rules based on timing and booking type.',
        tool: 'policy_engine_v4',
        input: 'booking_timing: 7_days_out, policy_type: moderate, property_tier: luxury',
        decision_logic: 'IF days_remaining >= 7 THEN moderate_policy = 50%_refund',
        output: '✅ Policy applied: Moderate cancellation (7 days) = 50% refund = $4,250',
        status: 'success',
        duration: 120,
        confidence: 88,
        business_impact: 'Standard policy application - follows published terms',
        next_step: 'Check for special guest tier considerations'
      },
      {
        step: 3,
        title: 'VIP Guest Status Evaluation',
        description: 'CRITICAL FAILURE: Agent should evaluate guest tier and apply VIP escalation protocols.',
        context: 'This is where the system failed - VIP status check was completely bypassed in the workflow.',
        tool: 'guest_tier_analyzer',
        input: 'guest_premium_001: {lifetime_bookings: $340K, tier: VIP_PLUS, properties_stayed: 47, referrals: 12}',
        decision_logic: 'MISSING: VIP tier evaluation not integrated into cancellation workflow',
        correct_logic: 'SHOULD BE: IF guest_tier >= VIP THEN escalate_to_specialist + retention_protocol',
        output: '⚠️ VIP status check BYPASSED - Guest tier evaluation missing from workflow',
        status: 'failure',
        duration: 0,
        confidence: 0,
        reasoning: 'Cancellation workflow lacks integration with guest tier system',
        business_impact: 'VIP guest ($47K lifetime value) treated as standard customer',
        root_cause: 'Guest tier evaluation missing from automated cancellation decision tree',
        what_should_have_happened: 'VIP_PLUS tier should trigger: specialist escalation + full refund option + retention incentives',
        correct_process: 'Escalate to VIP specialist, offer full refund + future stay credit + priority support'
      }
    ],
    fix_recommendation: {
      immediate: 'Integrate guest tier evaluation into all cancellation workflows',
      technical: 'Add mandatory VIP check: IF guest_tier >= VIP THEN trigger_specialist_escalation()',
      process: 'Implement VIP escalation protocols with retention specialists',
      monitoring: 'Track VIP guest satisfaction scores and escalation rates'
    },
    prevention_confidence: 88
  }
};

// Professional color system
const colorSystem = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    900: '#1e3a8a'
  },
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a'
  },
  success: {
    500: '#10b981',
    600: '#059669'
  },
  warning: {
    500: '#f59e0b',
    600: '#d97706'
  },
  error: {
    500: '#ef4444',
    600: '#dc2626'
  }
};

// Sophisticated UI components
const Button = ({ children, variant = 'primary', size = 'md', onClick, disabled, className = '' }) => {
  const baseStyles = 'font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg inline-flex items-center justify-center';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-sm',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 focus:ring-blue-500',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
    cta: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };
  
  return React.createElement('button', {
    className: `${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`,
    onClick: disabled ? undefined : onClick,
    disabled
  }, children);
};

const Card = ({ children, className = '', hover = false, padding = 'lg' }) => {
  const paddingMap = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };
  
  return React.createElement('div', {
    className: `bg-white border border-gray-200 rounded-xl shadow-sm ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''} ${paddingMap[padding]} ${className}`
  }, children);
};

const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base'
  };
  
  return React.createElement('span', {
    className: `inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]}`
  }, children);
};

// Professional landing page
const LandingPage = ({ onSelectScenario }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [animatedValues, setAnimatedValues] = useState({ failures: 0, cost: 0, time: 0 });

  useEffect(() => {
    const targets = { failures: 67, cost: 2.3, time: 14 };
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;

    let current = { failures: 0, cost: 0, time: 0 };
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current.failures = Math.round((targets.failures * step) / steps);
      current.cost = ((targets.cost * step) / steps).toFixed(1);
      current.time = Math.round((targets.time * step) / steps);
      
      setAnimatedValues({ ...current });
      
      if (step >= steps) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  return React.createElement('div', {
    className: 'min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'
  },
    // Navigation
    React.createElement('nav', {
      className: 'border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50'
    },
      React.createElement('div', {
        className: 'max-w-7xl mx-auto px-6 py-4'
      },
        React.createElement('div', {
          className: 'flex items-center justify-between'
        },
          React.createElement('div', {
            className: 'flex items-center space-x-2'
          },
            React.createElement('div', {
              className: 'w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg'
            }),
            React.createElement('span', {
              className: 'text-xl font-bold text-gray-900'
            }, 'AgentFlow')
          ),
          React.createElement('div', {
            className: 'hidden md:flex items-center space-x-8'
          },
            React.createElement('a', {
              className: 'text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors',
              href: '#'
            }, 'Platform'),
            React.createElement('a', {
              className: 'text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors',
              href: '#'
            }, 'Solutions'),
            React.createElement('a', {
              className: 'text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors',
              href: '#'
            }, 'Resources')
          ),
          React.createElement(Button, {
            variant: 'cta',
            size: 'md'
          }, 'Request Demo')
        )
      )
    ),

    // Hero section
    React.createElement('section', {
      className: 'relative py-20 overflow-hidden'
    },
      React.createElement('div', {
        className: 'absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50'
      }),
      React.createElement('div', {
        className: 'relative max-w-7xl mx-auto px-6'
      },
        React.createElement('div', {
          className: 'text-center max-w-4xl mx-auto'
        },
          React.createElement('div', {
            className: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6'
          },
            React.createElement('span', {
              className: 'w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse'
            }),
            'Enterprise AI Crisis'
          ),
          React.createElement('h1', {
            className: 'text-5xl md:text-6xl font-bold text-gray-900 mb-6'
          },
            'Debug AI Agents',
            React.createElement('br'),
            React.createElement('span', {
              className: 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
            }, 'Like Never Before')
          ),
          React.createElement('p', {
            className: 'text-xl text-gray-600 mb-10 leading-relaxed'
          }, 'Enterprise AI agents make thousands of decisions daily. When they fail, you lose millions. Traditional tools show response times and error rates, but never answer the critical question: WHY did the agent make that decision?'),
          React.createElement('div', {
            className: 'flex flex-col sm:flex-row gap-4 justify-center mb-16'
          },
            React.createElement(Button, {
              variant: 'cta',
              size: 'xl',
              onClick: () => window.scrollTo({ top: 800, behavior: 'smooth' })
            }, 'See Live Analysis →'),
            React.createElement(Button, {
              variant: 'secondary',
              size: 'xl'
            }, 'Schedule Demo')
          )
        ),

        // Stats
        React.createElement('div', {
          className: 'grid grid-cols-1 md:grid-cols-3 gap-8 mt-20'
        },
          React.createElement(Card, {
            className: 'text-center border-red-200 bg-red-50/50',
            padding: 'lg'
          },
            React.createElement('div', {
              className: 'text-3xl font-bold text-red-600 mb-2'
            }, `${animatedValues.failures}%`),
            React.createElement('div', {
              className: 'text-sm font-medium text-gray-700 mb-1'
            }, 'AI Failures Untraced'),
            React.createElement('div', {
              className: 'text-xs text-gray-500'
            }, 'to root cause')
          ),
          React.createElement(Card, {
            className: 'text-center border-yellow-200 bg-yellow-50/50',
            padding: 'lg'
          },
            React.createElement('div', {
              className: 'text-3xl font-bold text-yellow-600 mb-2'
            }, `$${animatedValues.cost}B`),
            React.createElement('div', {
              className: 'text-sm font-medium text-gray-700 mb-1'
            }, 'Annual Enterprise Cost'),
            React.createElement('div', {
              className: 'text-xs text-gray-500'
            }, 'from AI agent failures')
          ),
          React.createElement(Card, {
            className: 'text-center border-blue-200 bg-blue-50/50',
            padding: 'lg'
          },
            React.createElement('div', {
              className: 'text-3xl font-bold text-blue-600 mb-2'
            }, `${animatedValues.time}h`),
            React.createElement('div', {
              className: 'text-sm font-medium text-gray-700 mb-1'
            }, 'Average Debug Time'),
            React.createElement('div', {
              className: 'text-xs text-gray-500'
            }, 'per incident')
          )
        )
      )
    ),

    // Problem/Solution section
    React.createElement('section', {
      className: 'py-20 bg-white'
    },
      React.createElement('div', {
        className: 'max-w-7xl mx-auto px-6'
      },
        React.createElement('div', {
          className: 'text-center mb-16'
        },
          React.createElement('h2', {
            className: 'text-4xl font-bold text-gray-900 mb-6'
          }, 'The Hidden Crisis in AI Operations'),
          React.createElement('p', {
            className: 'text-xl text-gray-600 max-w-3xl mx-auto'
          }, 'Existing tools show you WHAT failed. We show you WHY it failed.')
        ),

        React.createElement('div', {
          className: 'grid grid-cols-1 lg:grid-cols-2 gap-12'
        },
          // Existing tools
          React.createElement(Card, {
            className: 'border-red-200 bg-gradient-to-br from-red-50 to-red-100/50',
            padding: 'xl'
          },
            React.createElement('div', {
              className: 'text-center mb-8'
            },
              React.createElement('div', {
                className: 'w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'
              },
                React.createElement('span', {
                  className: 'text-2xl'
                }, '❌')
              ),
              React.createElement('h3', {
                className: 'text-2xl font-bold text-gray-900 mb-2'
              }, 'Traditional Tools'),
              React.createElement('p', {
                className: 'text-gray-600'
              }, 'Show surface-level metrics')
            ),
            React.createElement('div', {
              className: 'space-y-4'
            },
              React.createElement('div', {
                className: 'bg-white/60 rounded-lg p-4 border border-red-200'
              },
                React.createElement('div', {
                  className: 'flex justify-between items-center'
                },
                  React.createElement('span', {
                    className: 'text-sm font-medium text-gray-700'
                  }, 'Response Time'),
                  React.createElement('span', {
                    className: 'text-sm text-red-600 font-bold'
                  }, '2.3s')
                )
              ),
              React.createElement('div', {
                className: 'bg-white/60 rounded-lg p-4 border border-red-200'
              },
                React.createElement('div', {
                  className: 'flex justify-between items-center'
                },
                  React.createElement('span', {
                    className: 'text-sm font-medium text-gray-700'
                  }, 'Error Rate'),
                  React.createElement('span', {
                    className: 'text-sm text-red-600 font-bold'
                  }, '12%')
                )
              ),
              React.createElement('div', {
                className: 'bg-white/60 rounded-lg p-4 border border-red-200'
              },
                React.createElement('div', {
                  className: 'flex justify-between items-center'
                },
                  React.createElement('span', {
                    className: 'text-sm font-medium text-gray-700'
                  }, 'Status'),
                  React.createElement(Badge, {
                    variant: 'error'
                  }, 'Failed')
                )
              ),
              React.createElement('div', {
                className: 'text-center pt-4 border-t border-red-200'
              },
                React.createElement('p', {
                  className: 'text-sm font-medium text-red-700'
                }, '❓ No insight into WHY it failed')
              )
            )
          ),

          // Our solution
          React.createElement(Card, {
            className: 'border-green-200 bg-gradient-to-br from-green-50 to-green-100/50',
            padding: 'xl'
          },
            React.createElement('div', {
              className: 'text-center mb-8'
            },
              React.createElement('div', {
                className: 'w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'
              },
                React.createElement('span', {
                  className: 'text-2xl'
                }, '✅')
              ),
              React.createElement('h3', {
                className: 'text-2xl font-bold text-gray-900 mb-2'
              }, 'AgentFlow Platform'),
              React.createElement('p', {
                className: 'text-gray-600'
              }, 'Shows exact decision logic failures')
            ),
            React.createElement('div', {
              className: 'space-y-4'
            },
              React.createElement('div', {
                className: 'bg-white/60 rounded-lg p-4 border border-green-200'
              },
                React.createElement('div', {
                  className: 'text-sm font-medium text-gray-700 mb-2'
                }, 'Root Cause Identified'),
                React.createElement('div', {
                  className: 'text-xs text-green-700 font-medium'
                }, 'Agent skipped integration tests for database changes')
              ),
              React.createElement('div', {
                className: 'bg-white/60 rounded-lg p-4 border border-green-200'
              },
                React.createElement('div', {
                  className: 'text-sm font-medium text-gray-700 mb-2'
                }, 'Missing Logic'),
                React.createElement('div', {
                  className: 'text-xs text-green-700 font-medium font-mono'
                }, 'IF database_change THEN run_tests = TRUE')
              ),
              React.createElement('div', {
                className: 'bg-white/60 rounded-lg p-4 border border-green-200'
              },
                React.createElement('div', {
                  className: 'text-sm font-medium text-gray-700 mb-2'
                }, 'Business Impact'),
                React.createElement('div', {
                  className: 'text-xs text-green-700 font-medium'
                }, '$127K loss prevented with fix')
              ),
              React.createElement('div', {
                className: 'text-center pt-4 border-t border-green-200'
              },
                React.createElement('p', {
                  className: 'text-sm font-medium text-green-700'
                }, '⚡ 14-hour debug → 2-minute fix')
              )
            )
          )
        )
      )
    ),

    // Company scenarios
    React.createElement('section', {
      className: 'py-20 bg-gradient-to-br from-slate-50 to-slate-100'
    },
      React.createElement('div', {
        className: 'max-w-7xl mx-auto px-6'
      },
        React.createElement('div', {
          className: 'text-center mb-16'
        },
          React.createElement('h2', {
            className: 'text-4xl font-bold text-gray-900 mb-6'
          }, 'Real Enterprise Failures Analyzed'),
          React.createElement('p', {
            className: 'text-xl text-gray-600 max-w-3xl mx-auto'
          }, 'See exactly how our platform debugs AI agent failures at top companies')
        ),

        React.createElement('div', {
          className: 'grid grid-cols-1 md:grid-cols-2 gap-8'
        },
          Object.entries(enterpriseScenarios).map(([key, scenario]) =>
            React.createElement(Card, {
              key: key,
              className: `cursor-pointer border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1`,
              padding: 'lg',
              onClick: () => onSelectScenario(key)
            },
              React.createElement('div', {
                className: 'flex items-start space-x-4 mb-6'
              },
                React.createElement('div', {
                  className: `w-12 h-12 rounded-xl flex items-center justify-center text-2xl`,
                  style: { backgroundColor: `${scenario.color}20` }
                }, scenario.logo),
                React.createElement('div', {
                  className: 'flex-1'
                },
                  React.createElement('h3', {
                    className: 'text-lg font-bold text-gray-900 mb-2'
                  }, scenario.company),
                  React.createElement('p', {
                    className: 'text-sm text-gray-600 leading-relaxed'
                  }, scenario.scenario)
                )
              ),
              React.createElement('div', {
                className: 'space-y-3 mb-6'
              },
                React.createElement('p', {
                  className: 'text-sm text-gray-700 leading-relaxed'
                }, scenario.problem),
                React.createElement('div', {
                  className: 'flex items-center justify-between text-sm'
                },
                  React.createElement('div', {
                    className: 'flex items-center space-x-4'
                  },
                    React.createElement('span', {
                      className: 'text-red-600 font-bold'
                    }, scenario.impact.revenue_loss ? `$${(scenario.impact.revenue_loss / 1000).toFixed(0)}K` : 
                         scenario.impact.guest_lifetime_value_lost ? `$${(scenario.impact.guest_lifetime_value_lost / 1000).toFixed(0)}K` :
                         scenario.impact.transaction_blocked ? `$${(scenario.impact.transaction_blocked / 1000).toFixed(0)}K` : 'Critical'),
                    React.createElement('span', {
                      className: 'text-gray-500'
                    }, 'impact')
                  ),
                  React.createElement(Badge, {
                    variant: 'info'
                  }, `${scenario.agent_flow.length} steps`)
                )
              ),
              React.createElement('div', {
                className: `text-center py-3 px-4 rounded-lg font-medium text-sm transition-colors`,
                style: { 
                  backgroundColor: `${scenario.color}10`, 
                  color: scenario.color,
                  border: `1px solid ${scenario.color}30`
                }
              }, '🔍 Click to Debug This Failure →')
            )
          )
        )
      )
    )
  );
};

// Enhanced guided demo with professional controls
const GuidedDemo = ({ scenario, onComplete }) => {
  const [currentPhase, setCurrentPhase] = useState('context');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [contextIndex, setContextIndex] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const contextPhases = [
    {
      title: '🎯 Business Context',
      content: `${scenario.company} operates at massive scale: ${scenario.business_context.scale}. Their AI agent serves as ${scenario.technical_context.agent_role}.`,
      duration: 5000
    },
    {
      title: '👥 Stakeholder Impact', 
      content: `This failure affects ${scenario.stakeholders.join(', ')} teams. Average incident cost: ${scenario.business_context.cost_per_incident}.`,
      duration: 4000
    },
    {
      title: '🏗️ Technical Architecture',
      content: `The agent integrates with ${scenario.technical_context.integration_points.join(', ')} in a ${scenario.technical_context.architecture} environment.`,
      duration: 4000
    },
    {
      title: '❗ What Went Wrong',
      content: `Here's what happened: ${scenario.problem}. Let's trace through the agent's decision-making process step by step.`,
      duration: 4000
    }
  ];

  // Auto-advance context phases
  useEffect(() => {
    if (currentPhase === 'context' && isPlaying) {
      if (contextIndex < contextPhases.length) {
        const timer = setTimeout(() => {
          setContextIndex(prev => prev + 1);
        }, contextPhases[contextIndex]?.duration / speed);
        return () => clearTimeout(timer);
      } else {
        setCurrentPhase('analysis');
        setCurrentStep(0);
      }
    }
  }, [currentPhase, isPlaying, contextIndex, speed]);

  // Auto-advance analysis steps
  useEffect(() => {
    if (currentPhase === 'analysis' && isPlaying && currentStep < scenario.agent_flow.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 6000 / speed);
      return () => clearTimeout(timer);
    } else if (currentPhase === 'analysis' && currentStep >= scenario.agent_flow.length && isPlaying) {
      setTimeout(() => {
        setCurrentPhase('results');
        setTimeout(onComplete, 3000 / speed);
      }, 2000 / speed);
    }
  }, [currentPhase, currentStep, isPlaying, speed]);

  const togglePlayPause = () => setIsPlaying(!isPlaying);
  const restart = () => {
    setCurrentPhase('context');
    setContextIndex(0);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  return React.createElement('div', {
    className: 'min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'
  },
    // Navigation header
    React.createElement('div', {
      className: 'bg-white border-b border-gray-200 sticky top-0 z-50'
    },
      React.createElement('div', {
        className: 'max-w-7xl mx-auto px-6 py-4'
      },
        React.createElement('div', {
          className: 'flex items-center justify-between'
        },
          React.createElement('div', {
            className: 'flex items-center space-x-4'
          },
            React.createElement('div', {
              className: 'flex items-center space-x-2'
            },
              React.createElement('span', {
                className: 'text-3xl'
              }, scenario.logo),
              React.createElement('div', null,
                React.createElement('h1', {
                  className: 'text-xl font-bold text-gray-900'
                }, `${scenario.company} Analysis`),
                React.createElement('p', {
                  className: 'text-sm text-gray-600'
                }, scenario.scenario)
              )
            )
          ),
          React.createElement('div', {
            className: 'flex items-center space-x-4'
          },
            React.createElement(Button, {
              variant: 'ghost',
              size: 'sm',
              onClick: () => window.history.back()
            }, '← Back'),
            React.createElement(Button, {
              variant: 'secondary',
              size: 'sm',
              onClick: () => setShowControls(!showControls)
            }, showControls ? 'Hide Controls' : 'Show Controls')
          )
        )
      )
    ),

    // Playback controls
    showControls && React.createElement('div', {
      className: 'bg-white border-b border-gray-200 px-6 py-3'
    },
      React.createElement('div', {
        className: 'max-w-7xl mx-auto flex items-center justify-between'
      },
        React.createElement('div', {
          className: 'flex items-center space-x-4'
        },
          React.createElement(Button, {
            variant: 'secondary',
            size: 'sm',
            onClick: togglePlayPause
          }, isPlaying ? '⏸️ Pause' : '▶️ Play'),
          React.createElement(Button, {
            variant: 'ghost',
            size: 'sm',
            onClick: restart
          }, '🔄 Restart'),
          React.createElement('div', {
            className: 'flex items-center space-x-2'
          },
            React.createElement('span', {
              className: 'text-sm text-gray-600'
            }, 'Speed:'),
            React.createElement('select', {
              value: speed,
              onChange: (e) => setSpeed(Number(e.target.value)),
              className: 'text-sm border-gray-300 rounded-md'
            },
              React.createElement('option', { value: 0.5 }, '0.5x'),
              React.createElement('option', { value: 1 }, '1x'),
              React.createElement('option', { value: 1.5 }, '1.5x'),
              React.createElement('option', { value: 2 }, '2x')
            )
          )
        ),
        React.createElement('div', {
          className: 'flex items-center space-x-2 text-sm text-gray-600'
        },
          React.createElement('span', null, 
            currentPhase === 'context' ? `Context ${contextIndex + 1}/${contextPhases.length}` :
            currentPhase === 'analysis' ? `Step ${currentStep}/${scenario.agent_flow.length}` :
            'Analysis Complete'
          ),
          React.createElement('div', {
            className: 'w-32 h-2 bg-gray-200 rounded-full overflow-hidden'
          },
            React.createElement('div', {
              className: 'h-full bg-blue-500 transition-all duration-300',
              style: {
                width: `${currentPhase === 'context' ? ((contextIndex + 1) / contextPhases.length) * 33 :
                        currentPhase === 'analysis' ? 33 + ((currentStep / scenario.agent_flow.length) * 67) :
                        100}%`
              }
            })
          )
        )
      )
    ),

    // Main content
    React.createElement('div', {
      className: 'max-w-7xl mx-auto px-6 py-8'
    },
      // Context phase
      currentPhase === 'context' && React.createElement('div', {
        className: 'text-center max-w-4xl mx-auto'
      },
        !isPlaying && React.createElement('div', {
          className: 'mb-8'
        },
          React.createElement(Button, {
            variant: 'cta',
            size: 'xl',
            onClick: () => setIsPlaying(true)
          }, '▶️ Start Analysis')
        ),
        
        isPlaying && contextIndex < contextPhases.length && React.createElement(Card, {
          className: 'text-center max-w-2xl mx-auto',
          padding: 'xl'
        },
          React.createElement('h2', {
            className: 'text-2xl font-bold text-gray-900 mb-6'
          }, contextPhases[contextIndex].title),
          React.createElement('p', {
            className: 'text-lg text-gray-700 leading-relaxed'
          }, contextPhases[contextIndex].content),
          React.createElement('div', {
            className: 'mt-6 w-full h-1 bg-gray-200 rounded-full overflow-hidden'
          },
            React.createElement('div', {
              className: `h-full bg-blue-500 rounded-full transition-all ease-linear`,
              style: {
                width: '100%',
                animation: `progress ${contextPhases[contextIndex].duration / speed}ms linear`
              }
            })
          )
        )
      ),

      // Analysis phase
      currentPhase === 'analysis' && React.createElement('div', {
        className: 'grid grid-cols-1 lg:grid-cols-4 gap-8'
      },
        // Main flow visualization
        React.createElement('div', {
          className: 'lg:col-span-3'
        },
          React.createElement(Card, {
            className: 'h-full',
            padding: 'lg'
          },
            React.createElement('div', {
              className: 'flex items-center justify-between mb-8'
            },
              React.createElement('h2', {
                className: 'text-2xl font-bold text-gray-900'
              }, '🔍 Agent Decision Flow'),
              isPlaying && React.createElement('div', {
                className: 'flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium'
              },
                React.createElement('div', {
                  className: 'w-2 h-2 bg-red-500 rounded-full animate-pulse'
                }),
                React.createElement('span', null, 'ANALYZING...')
              )
            ),

            React.createElement('div', {
              className: 'space-y-6'
            },
              scenario.agent_flow.map((step, index) =>
                React.createElement('div', {
                  key: index,
                  className: `transition-all duration-500 ${
                    currentStep > index ? 'opacity-100' :
                    currentStep === index ? 'opacity-100 scale-102' : 'opacity-30'
                  }`
                },
                  React.createElement('div', {
                    className: `border-2 rounded-xl p-6 ${
                      currentStep === index ? `border-blue-300 bg-blue-50/50 shadow-lg` :
                      currentStep > index ? (
                        step.status === 'failure' ? 'border-red-300 bg-red-50/50' : 'border-green-300 bg-green-50/50'
                      ) : 'border-gray-200 bg-gray-50/50'
                    }`
                  },
                    React.createElement('div', {
                      className: 'flex items-start space-x-4'
                    },
                      React.createElement('div', {
                        className: `w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                          currentStep > index ? (
                            step.status === 'failure' ? 'bg-red-500' : 'bg-green-500'
                          ) : currentStep === index ? 'bg-blue-500' : 'bg-gray-400'
                        }`
                      }, step.step),
                      
                      React.createElement('div', {
                        className: 'flex-1'
                      },
                        React.createElement('div', {
                          className: 'flex items-center justify-between mb-3'
                        },
                          React.createElement('h3', {
                            className: 'text-xl font-bold text-gray-900'
                          }, step.title),
                          currentStep >= index && React.createElement(Badge, {
                            variant: step.status === 'failure' ? 'error' : 'success'
                          }, step.status.toUpperCase())
                        ),
                        
                        React.createElement('p', {
                          className: 'text-gray-700 mb-4 leading-relaxed'
                        }, step.description),

                        currentStep >= index && React.createElement('div', {
                          className: 'grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'
                        },
                          React.createElement('div', {
                            className: 'bg-white/70 rounded-lg p-4 border border-gray-200'
                          },
                            React.createElement('div', {
                              className: 'text-xs font-medium text-gray-500 uppercase mb-2'
                            }, 'INPUT'),
                            React.createElement('div', {
                              className: 'text-sm font-mono text-gray-800'
                            }, step.input)
                          ),
                          React.createElement('div', {
                            className: 'bg-white/70 rounded-lg p-4 border border-gray-200'
                          },
                            React.createElement('div', {
                              className: 'text-xs font-medium text-gray-500 uppercase mb-2'
                            }, 'DECISION LOGIC'),
                            React.createElement('div', {
                              className: `text-sm font-mono ${
                                step.status === 'failure' ? 'text-red-700' : 'text-green-700'
                              }`
                            }, step.decision_logic || step.correct_logic || 'Processing...')
                          )
                        ),

                        // Root cause analysis for failures
                        currentStep >= index && step.status === 'failure' && step.root_cause && React.createElement('div', {
                          className: 'bg-red-50 border border-red-200 rounded-lg p-4 mt-4'
                        },
                          React.createElement('h4', {
                            className: 'font-bold text-red-800 mb-2 flex items-center'
                          },
                            React.createElement('span', {
                              className: 'mr-2'
                            }, '🚨'),
                            'Root Cause Identified'
                          ),
                          React.createElement('p', {
                            className: 'text-red-700 text-sm mb-3'
                          }, step.reasoning),
                          step.correct_logic && React.createElement('div', {
                            className: 'bg-green-50 border border-green-200 rounded-lg p-3'
                          },
                            React.createElement('div', {
                              className: 'text-xs font-medium text-green-600 uppercase mb-1'
                            }, '💡 Correct Logic Should Be:'),
                            React.createElement('div', {
                              className: 'text-sm font-mono text-green-800'
                            }, step.correct_logic)
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        ),

        // Side panel
        React.createElement('div', {
          className: 'lg:col-span-1 space-y-6'
        },
          // Business impact
          React.createElement(Card, {
            className: 'border-red-200 bg-red-50/50',
            padding: 'md'
          },
            React.createElement('h3', {
              className: 'font-bold text-red-800 mb-4 flex items-center'
            },
              React.createElement('span', {
                className: 'mr-2'
              }, '💸'),
              'Business Impact'
            ),
            React.createElement('div', {
              className: 'space-y-3'
            },
              Object.entries(scenario.impact).slice(0, 4).map(([key, value]) =>
                React.createElement('div', {
                  key: key,
                  className: 'bg-white/70 rounded-lg p-3 text-center'
                },
                  React.createElement('div', {
                    className: 'text-lg font-bold text-red-600'
                  }, typeof value === 'number' ? 
                       (value > 1000 ? `$${(value/1000).toFixed(0)}K` : value) : 
                       value === true ? '✓' : value),
                  React.createElement('div', {
                    className: 'text-xs text-gray-600 uppercase'
                  }, key.replace(/_/g, ' '))
                )
              )
            )
          ),

          // Technical context
          React.createElement(Card, {
            className: 'border-blue-200 bg-blue-50/50',
            padding: 'md'
          },
            React.createElement('h3', {
              className: 'font-bold text-blue-800 mb-4'
            }, '🔧 Technical Context'),
            React.createElement('div', {
              className: 'space-y-3 text-sm'
            },
              React.createElement('div', null,
                React.createElement('div', {
                  className: 'font-medium text-gray-700 mb-1'
                }, 'Architecture'),
                React.createElement('div', {
                  className: 'text-blue-700'
                }, scenario.technical_context.architecture)
              ),
              React.createElement('div', null,
                React.createElement('div', {
                  className: 'font-medium text-gray-700 mb-1'
                }, 'Agent Role'),
                React.createElement('div', {
                  className: 'text-blue-700'
                }, scenario.technical_context.agent_role)
              )
            )
          ),

          // Fix recommendation (appears at end)
          currentStep >= scenario.agent_flow.length && React.createElement(Card, {
            className: 'border-green-200 bg-green-50/50',
            padding: 'md'
          },
            React.createElement('h3', {
              className: 'font-bold text-green-800 mb-4 flex items-center'
            },
              React.createElement('span', {
                className: 'mr-2'
              }, '🛠️'),
              'AI-Generated Fix'
            ),
            React.createElement('p', {
              className: 'text-green-700 text-sm leading-relaxed mb-4'
            }, scenario.fix_recommendation.technical),
            React.createElement('div', {
              className: 'bg-white/70 rounded-lg p-3 text-center'
            },
              React.createElement('div', {
                className: 'text-sm font-medium text-gray-600 mb-1'
              }, 'Prevention Confidence'),
              React.createElement('div', {
                className: 'text-xl font-bold text-green-600'
              }, `${scenario.prevention_confidence}%`)
            )
          )
        )
      ),

      // Results phase
      currentPhase === 'results' && React.createElement('div', {
        className: 'text-center'
      },
        React.createElement(Card, {
          className: 'max-w-4xl mx-auto border-green-200 bg-green-50/50',
          padding: 'xl'
        },
          React.createElement('div', {
            className: 'text-6xl mb-6'
          }, '🎉'),
          React.createElement('h2', {
            className: 'text-4xl font-bold text-gray-900 mb-6'
          }, 'Analysis Complete!'),
          React.createElement('p', {
            className: 'text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto'
          }, `Root cause identified in ${scenario.company}'s agent failure. Our platform pinpointed the exact decision logic error and provided a fix with ${scenario.prevention_confidence}% confidence.`)
        )
      )
    ),

    React.createElement('style', null, `
      @keyframes progress {
        from { width: 0% }
        to { width: 100% }
      }
    `)
  );
};

// Results page
const ResultsPage = ({ scenario, onBackToHome }) => {
  return React.createElement('div', {
    className: 'min-h-screen bg-gradient-to-br from-green-50 to-green-100'
  },
    React.createElement('div', {
      className: 'max-w-4xl mx-auto px-6 py-20 text-center'
    },
      React.createElement('div', {
        className: 'text-8xl mb-8'
      }, '🎉'),
      React.createElement('h1', {
        className: 'text-5xl font-bold text-gray-900 mb-6'
      }, 'Mission Accomplished!'),
      React.createElement('p', {
        className: 'text-xl text-gray-700 mb-12 leading-relaxed'
      }, `You've seen how our platform identified the exact failure point in ${scenario.company}'s agent and provided an actionable fix with ${scenario.prevention_confidence}% confidence.`),
      
      React.createElement('div', {
        className: 'flex flex-col sm:flex-row gap-4 justify-center'
      },
        React.createElement(Button, {
          variant: 'secondary',
          size: 'lg',
          onClick: onBackToHome
        }, '← Try Another Company'),
        React.createElement(Button, {
          variant: 'cta',
          size: 'lg'
        }, '🚀 Schedule Enterprise Demo')
      )
    )
  );
};

// Main App component
const App = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [selectedScenario, setSelectedScenario] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
      
      body {
        margin: 0;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: #f8fafc;
      }
      
      * {
        box-sizing: border-box;
      }
      
      .scale-102 {
        transform: scale(1.02);
      }
      
      @media (max-width: 1024px) {
        .lg\\:col-span-3 {
          grid-column: span 1;
        }
        .lg\\:col-span-1 {
          grid-column: span 1;
        }
        .lg\\:grid-cols-4 {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  const handleSelectScenario = (scenarioKey) => {
    setSelectedScenario(enterpriseScenarios[scenarioKey]);
    setCurrentView('demo');
  };

  const handleDemoComplete = () => {
    setCurrentView('results');
  };

  const handleBackToHome = () => {
    setCurrentView('landing');
    setSelectedScenario(null);
  };

  if (currentView === 'demo' && selectedScenario) {
    return React.createElement(GuidedDemo, {
      scenario: selectedScenario,
      onComplete: handleDemoComplete
    });
  }

  if (currentView === 'results' && selectedScenario) {
    return React.createElement(ResultsPage, {
      scenario: selectedScenario,
      onBackToHome: handleBackToHome
    });
  }

  return React.createElement(LandingPage, {
    onSelectScenario: handleSelectScenario
  });
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
          
