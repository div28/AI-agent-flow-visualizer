const { useState, useEffect } = React;

// Enterprise scenarios with clear differentiation
const enterpriseScenarios = {
  atlassian: {
    company: 'Atlassian',
    logo: '🔷',
    color: '#0052CC',
    scenario: 'DevOps Deployment Agent Failure',
    problem: 'Production deployment agent bypassed critical integration tests',
    why_existing_tools_failed: 'LangSmith showed response times but not WHY agent skipped tests',
    our_solution: 'Visualize exact decision tree where agent chose wrong path',
    business_context: 'Rovo AI handles 10,000+ deployments/day. One bad decision = $127K loss.',
    impact: {
      revenue_loss: 127000,
      downtime_hours: 6,
      customers_affected: 15000,
      deployments_blocked: 847
    },
    agent_flow: [
      {
        step: 1,
        title: 'Code Analysis',
        description: 'Agent scans database migration files for syntax errors',
        tool: 'code_analyzer_v2',
        input: 'database_migration.sql (47 lines)',
        decision: 'PROCEED - No syntax errors detected',
        output: '✅ Syntax validation passed',
        status: 'success',
        duration: '245ms',
        confidence: '99%',
        reasoning: 'Standard validation protocol - checking for SQL syntax errors'
      },
      {
        step: 2,
        title: 'Security Scan',
        description: 'Agent performs security vulnerability assessment',
        tool: 'security_scanner',
        input: 'full_codebase (12,847 files)',
        decision: 'PROCEED - No vulnerabilities found',
        output: '✅ No security issues detected',
        status: 'success',
        duration: '1.2s',
        confidence: '95%',
        reasoning: 'Comprehensive security scan completed successfully'
      },
      {
        step: 3,
        title: 'Integration Test Decision',
        description: 'CRITICAL FAILURE: Agent evaluates whether integration tests are needed',
        tool: 'test_orchestrator',
        input: 'change_type: database_schema, risk_level: ?',
        decision: 'SKIP TESTS - Classified as "low risk change"',
        output: '⚠️ Integration tests bypassed',
        status: 'failure',
        duration: '0ms',
        confidence: '0%',
        reasoning: 'MISSING LOGIC: Agent failed to detect that database schema changes always require integration tests',
        what_should_have_happened: 'IF database_schema_change THEN run_integration_tests = TRUE',
        business_impact: 'This decision directly caused production failure'
      },
      {
        step: 4,
        title: 'Production Deployment',
        description: 'Agent proceeds to deploy without proper testing',
        tool: 'deployment_engine',
        input: 'target: production, tests_passed: false',
        decision: 'DEPLOY - Based on previous steps',
        output: '❌ Database connection pool exhausted - ROLLBACK INITIATED',
        status: 'failure',
        duration: '30s',
        confidence: '0%',
        reasoning: 'Deployment failed because untested database changes overwhelmed connection pool'
      }
    ],
    root_cause: 'Missing conditional logic: IF database_changes THEN require_integration_tests = TRUE',
    fix: 'Add mandatory integration test checkpoint for any database schema modifications',
    prevention_confidence: '96%'
  },
  stripe: {
    company: 'Stripe',
    logo: '💳',
    color: '#635BFF',
    scenario: 'Multi-Agent Fraud Detection Conflict',
    problem: 'Payment processing agents returned conflicting fraud scores for legitimate transaction',
    why_existing_tools_failed: 'AgentOps showed agent metrics but not decision conflicts between multiple agents',
    our_solution: 'Visualize multi-agent coordination failures and consensus breakdowns',
    business_context: 'Processes $640B annually. False positives block legitimate transactions.',
    impact: {
      revenue_loss: 50000,
      false_positive_rate: 12,
      merchant_complaints: 3,
      escalation_required: true
    },
    agent_flow: [
      {
        step: 1,
        title: 'Transaction Velocity Check',
        description: 'Agent analyzes transaction frequency patterns',
        tool: 'velocity_analyzer',
        input: 'user_id: merchant_vip_001, amount: $50,000, timeframe: 24h',
        decision: 'APPROVE - Within historical patterns',
        output: '✅ Velocity within normal range (3 transactions today vs avg 2.4)',
        status: 'success',
        duration: '120ms',
        confidence: '89%',
        reasoning: 'Merchant has history of similar transaction amounts and frequency'
      },
      {
        step: 2,
        title: 'Device & Location Analysis',
        description: 'Agent verifies device fingerprint and geographic location',
        tool: 'device_intelligence',
        input: 'device_fingerprint: known_device_001, location: San Francisco, CA',
        decision: 'APPROVE - Recognized device and location',
        output: '✅ Known device from expected location',
        status: 'success',
        duration: '80ms',
        confidence: '94%',
        reasoning: 'Device matches merchant profile, location consistent with business address'
      },
      {
        step: 3,
        title: 'Multi-Agent Risk Coordination',
        description: 'CRITICAL FAILURE: Multiple agents provide conflicting risk assessments',
        tool: 'agent_orchestrator',
        input: 'velocity_agent_score: 0.15 (low risk), device_agent_score: 0.85 (high risk)',
        decision: 'CONFLICT - No consensus mechanism available',
        output: '❌ Agents disagree: 0.15 vs 0.85 risk scores - Transaction blocked by default',
        status: 'failure',
        duration: '5s',
        confidence: '0%',
        reasoning: 'MISSING ORCHESTRATION: No protocol exists for resolving conflicting agent decisions',
        what_should_have_happened: 'Implement weighted consensus: velocity_weight=0.7, device_weight=0.3 → final_score = 0.36 → APPROVE',
        business_impact: 'Legitimate $50K transaction blocked, VIP merchant escalation required'
      }
    ],
    root_cause: 'Missing multi-agent coordination layer with weighted consensus algorithm',
    fix: 'Implement agent decision orchestrator with confidence-weighted voting system',
    prevention_confidence: '91%'
  },
  github: {
    company: 'GitHub',
    logo: '🐙',
    color: '#24292e',
    scenario: 'Security Agent False Negative',
    problem: 'Code review agent approved PR containing hardcoded production API keys',
    why_existing_tools_failed: 'Existing tools detected the pattern but missed context validation',
    our_solution: 'Show exactly why agent failed to validate if detected secrets were real vs dummy',
    business_context: 'Secures 100M+ repositories. One exposed key = security incident.',
    impact: {
      security_incident: true,
      keys_exposed: 3,
      repositories_affected: 12,
      compliance_violation: true
    },
    agent_flow: [
      {
        step: 1,
        title: 'Pattern Detection',
        description: 'Agent scans PR files for hardcoded secrets using regex patterns',
        tool: 'secret_scanner',
        input: 'pr_files: 14 changed files, patterns: API_KEY, SECRET, TOKEN',
        decision: 'FOUND - Multiple API key patterns detected',
        output: '✅ Found 3 potential API keys in config files',
        status: 'success',
        duration: '180ms',
        confidence: '97%',
        reasoning: 'Regex patterns matched standard API key formats'
      },
      {
        step: 2,
        title: 'Context Validation',
        description: 'CRITICAL FAILURE: Agent should validate if detected keys are real or test dummies',
        tool: 'context_validator',
        input: 'detected_keys: ["sk_live_...", "pk_test_...", "api_key_example"]',
        decision: 'SKIP VALIDATION - Assumed all patterns are violations',
        output: '⚠️ Context validation bypassed',
        status: 'failure',
        duration: '0ms',
        confidence: '0%',
        reasoning: 'MISSING VALIDATION: Agent failed to check if keys were dummy/example values',
        what_should_have_happened: 'Validate each key: sk_live_* = REAL (block), pk_test_* = TEST (allow), api_key_example = DUMMY (allow)',
        business_impact: 'False positive blocked legitimate PR with test keys and examples'
      },
      {
        step: 3,
        title: 'Auto-Approval Decision',
        description: 'Agent makes final approval decision based on incomplete analysis',
        tool: 'pr_decision_engine',
        input: 'secrets_found: true, validation_complete: false',
        decision: 'APPROVE - Assumed false positive due to incomplete context',
        output: '❌ PR approved with real production API key exposed',
        status: 'failure',
        duration: '50ms',
        confidence: '0%',
        reasoning: 'Agent incorrectly assumed all detected patterns were false positives'
      }
    ],
    root_cause: 'Missing secret validation logic to distinguish real keys from test/dummy values',
    fix: 'Implement context-aware secret validation with key format analysis',
    prevention_confidence: '94%'
  },
  airbnb: {
    company: 'Airbnb',
    logo: '🏠',
    color: '#FF5A5F',
    scenario: 'Customer Service Agent Escalation Miss',
    problem: 'Support agent missed VIP guest escalation for high-value booking cancellation',
    why_existing_tools_failed: 'Customer service tools tracked resolution time but not guest value assessment',
    our_solution: 'Visualize customer tier evaluation and escalation decision logic',
    business_context: 'Handles 4M+ bookings/year. VIP guest churn = $47K lifetime value loss.',
    impact: {
      guest_lifetime_value_lost: 47000,
      booking_value: 8500,
      vip_status_lost: true,
      negative_review_posted: true
    },
    agent_flow: [
      {
        step: 1,
        title: 'Cancellation Request Processing',
        description: 'Agent processes guest request to cancel upcoming reservation',
        tool: 'booking_manager',
        input: 'booking_id: BK_789456, guest_id: guest_vip_premium_001, value: $8,500',
        decision: 'PROCESS - Valid cancellation request received',
        output: '✅ Cancellation request validated and queued',
        status: 'success',
        duration: '340ms',
        confidence: '99%',
        reasoning: 'Standard cancellation request processing initiated'
      },
      {
        step: 2,
        title: 'Policy Application',
        description: 'Agent applies standard cancellation policy without guest tier consideration',
        tool: 'policy_engine',
        input: 'booking_date: 7 days out, policy: moderate, refund_eligible: 50%',
        decision: 'APPLY STANDARD POLICY - 50% refund',
        output: '✅ Standard cancellation policy applied: 50% refund = $4,250',
        status: 'success',
        duration: '120ms',
        confidence: '88%',
        reasoning: 'Applied standard moderate cancellation policy based on timing'
      },
      {
        step: 3,
        title: 'VIP Status Check',
        description: 'CRITICAL FAILURE: Agent should check guest VIP status for special handling',
        tool: 'guest_tier_analyzer',
        input: 'guest_id: guest_vip_premium_001, lifetime_bookings: $340K, tier: VIP_PLUS',
        decision: 'SKIP VIP CHECK - Not in standard workflow',
        output: '⚠️ VIP status evaluation bypassed',
        status: 'failure',
        duration: '0ms',
        confidence: '0%',
        reasoning: 'MISSING INTEGRATION: Agent workflow lacks VIP tier evaluation step',
        what_should_have_happened: 'IF guest_tier >= VIP THEN escalate_to_specialist + offer_full_refund + retention_incentives',
        business_impact: 'VIP guest (47K LTV) received standard treatment instead of white-glove service'
      },
      {
        step: 4,
        title: 'Automatic Processing',
        description: 'Agent completes cancellation without escalation',
        tool: 'fulfillment_engine',
        input: 'refund_amount: $4,250, escalation_required: false',
        decision: 'COMPLETE - Process standard refund',
        output: '❌ VIP guest churned due to poor experience',
        status: 'failure',
        duration: '200ms',
        confidence: '0%',
        reasoning: 'Completed standard process without recognizing high-value guest'
      }
    ],
    root_cause: 'Missing guest tier integration in cancellation workflow decision tree',
    fix: 'Add mandatory VIP status check with automatic specialist escalation',
    prevention_confidence: '88%'
  }
};

// Competitive landscape
const competitorData = {
  'Our Solution': {
    decision_flow_viz: true,
    business_impact_calc: true,
    multi_agent_coordination: true,
    root_cause_analysis: true,
    fix_recommendations: true,
    prevention_confidence: true,
    score: 100
  },
  'LangSmith': {
    decision_flow_viz: false,
    business_impact_calc: false,
    multi_agent_coordination: false,
    root_cause_analysis: false,
    fix_recommendations: false,
    prevention_confidence: false,
    score: 20
  },
  'AgentOps': {
    decision_flow_viz: false,
    business_impact_calc: false,
    multi_agent_coordination: false,
    root_cause_analysis: false,
    fix_recommendations: false,
    prevention_confidence: false,
    score: 25
  },
  'W&B': {
    decision_flow_viz: false,
    business_impact_calc: false,
    multi_agent_coordination: false,
    root_cause_analysis: false,
    fix_recommendations: false,
    prevention_confidence: false,
    score: 15
  }
};

// Animated components
const AnimatedCounter = ({ value, duration = 2000, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startValue = 0;
    const endValue = parseInt(value.toString().replace(/,/g, ''));
    const increment = endValue / (duration / 16);

    const timer = setInterval(() => {
      startValue += increment;
      if (startValue >= endValue) {
        setCount(endValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(startValue));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return React.createElement('span', null, `${prefix}${count.toLocaleString()}${suffix}`);
};

const PulsingDot = ({ color = '#ef4444', size = '12px' }) => {
  return React.createElement('div', {
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: color,
      animation: 'pulse 2s infinite',
      display: 'inline-block'
    }
  });
};

const ProgressBar = ({ progress, color = '#3b82f6', height = '8px' }) => {
  return React.createElement('div', {
    style: {
      width: '100%',
      height: height,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '4px',
      overflow: 'hidden'
    }
  },
    React.createElement('div', {
      style: {
        width: `${progress}%`,
        height: '100%',
        backgroundColor: color,
        transition: 'width 1s ease-out',
        borderRadius: '4px'
      }
    })
  );
};

// Main landing page with problem statement
const LandingPage = ({ onSelectScenario }) => {
  const [currentStat, setCurrentStat] = useState(0);
  const stats = [
    { label: 'AI Agent Failures Cost', value: '$2.3B', subtitle: 'annually across Fortune 500' },
    { label: 'Average Debug Time', value: '14 hours', subtitle: 'to find root cause' },
    { label: 'Business Impact', value: '67%', subtitle: 'of failures untraced to source' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat(prev => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return React.createElement('div', {
    style: {
      background: `
        linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%),
        radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
      `,
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }
  },
    // Animated background particles
    React.createElement('div', {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat,
          linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.05) 50%, transparent 100%)
        `,
        animation: 'slide 20s linear infinite'
      }
    }),

    React.createElement('div', {
      style: {
        position: 'relative',
        zIndex: 10,
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '60px 20px'
      }
    },
      // Hero section
      React.createElement('div', {
        style: { textAlign: 'center', marginBottom: '80px' }
      },
        React.createElement('div', {
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '24px',
            padding: '8px 24px',
            marginBottom: '32px'
          }
        },
          React.createElement(PulsingDot),
          React.createElement('span', {
            style: { color: '#fca5a5', fontSize: '14px', fontWeight: '600' }
          }, 'ENTERPRISE AI CRISIS')
        ),

        React.createElement('h1', {
          style: {
            fontSize: 'clamp(48px, 10vw, 84px)',
            fontWeight: '900',
            color: 'white',
            marginBottom: '32px',
            lineHeight: '1.1',
            letterSpacing: '-0.02em'
          }
        },
          'AI Agents Are Failing',
          React.createElement('br'),
          React.createElement('span', {
            style: {
              background: 'linear-gradient(45deg, #ef4444, #f97316, #eab308)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }
          }, 'Silently & Expensively')
        ),

        React.createElement('p', {
          style: {
            fontSize: 'clamp(20px, 4vw, 28px)',
            color: '#94a3b8',
            maxWidth: '900px',
            margin: '0 auto 48px auto',
            lineHeight: '1.5',
            fontWeight: '400'
          }
        }, 'Enterprise AI agents make thousands of decisions daily. When they fail, you lose millions. Traditional tools show response times and error rates, but never answer the critical question: '),

        React.createElement('div', {
          style: {
            background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
            padding: '24px 48px',
            borderRadius: '20px',
            marginBottom: '48px',
            display: 'inline-block',
            boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)'
          }
        },
          React.createElement('h2', {
            style: {
              color: 'white',
              fontSize: 'clamp(24px, 5vw, 36px)',
              fontWeight: '700',
              margin: 0
            }
          }, '❓ WHY did the agent make that decision?')
        ),

        // Rotating stats
        React.createElement('div', {
          style: {
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '600px',
            margin: '0 auto'
          }
        },
          React.createElement('div', {
            style: {
              fontSize: '48px',
              fontWeight: '900',
              color: '#ef4444',
              marginBottom: '8px'
            }
          }, stats[currentStat].value),
          React.createElement('div', {
            style: {
              color: 'white',
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '4px'
            }
          }, stats[currentStat].label),
          React.createElement('div', {
            style: {
              color: '#94a3b8',
              fontSize: '14px'
            }
          }, stats[currentStat].subtitle)
        )
      ),

      // Problem illustration
      React.createElement('div', {
        style: {
          background: 'rgba(239, 68, 68, 0.05)',
          border: '2px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '24px',
          padding: '48px',
          marginBottom: '80px',
          position: 'relative',
          overflow: 'hidden'
        }
      },
        React.createElement('div', {
          style: {
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%)',
            animation: 'rotate 20s linear infinite'
          }
        }),

        React.createElement('div', {
          style: { position: 'relative', zIndex: 10, textAlign: 'center' }
        },
          React.createElement('h2', {
            style: {
              color: 'white',
              fontSize: 'clamp(28px, 6vw, 42px)',
              fontWeight: '700',
              marginBottom: '32px'
            }
          }, '🚨 The Hidden Crisis'),

          React.createElement('div', {
            style: {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px',
              marginBottom: '48px'
            }
          },
            React.createElement('div', {
              style: {
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }
            },
              React.createElement('div', {
                style: { fontSize: '32px', marginBottom: '16px' }
              }, '🔍'),
              React.createElement('h3', {
                style: {
                  color: '#fca5a5',
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '12px'
                }
              }, 'Existing Tools Show WHAT Failed'),
              React.createElement('ul', {
                style: {
                  color: '#fecaca',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  paddingLeft: '20px'
                }
              },
                React.createElement('li', null, 'Response time: 2.3s'),
                React.createElement('li', null, 'Error rate: 12%'),
                React.createElement('li', null, 'Agent calls: 47'),
                React.createElement('li', null, 'Status: Failed ❌')
              )
            ),

            React.createElement('div', {
              style: {
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }
            },
              React.createElement('div', {
                style: { fontSize: '32px', marginBottom: '16px' }
              }, '🎯'),
              React.createElement('h3', {
                style: {
                  color: '#6ee7b7',
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '12px'
                }
              }, 'Our Platform Shows WHY It Failed'),
              React.createElement('ul', {
                style: {
                  color: '#a7f3d0',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  paddingLeft: '20px'
                }
              },
                React.createElement('li', null, 'Agent skipped integration tests'),
                React.createElement('li', null, 'Missing conditional logic'),
                React.createElement('li', null, 'Decision tree gap identified'),
                React.createElement('li', null, 'Fix: Add IF database_change THEN test')
              )
            )
          ),

          React.createElement('div', {
            style: {
              background: 'linear-gradient(45deg, #ef4444, #dc2626)',
              color: 'white',
              padding: '24px',
              borderRadius: '16px',
              fontSize: '18px',
              fontWeight: '600'
            }
          }, '⚡ Result: Turn 14-hour debugging sessions into 2-minute root cause analysis')
        )
      ),

      // Company scenarios
      React.createElement('div', {
        style: { textAlign: 'center', marginBottom: '48px' }
      },
        React.createElement('h2', {
          style: {
            color: 'white',
            fontSize: 'clamp(32px, 7vw, 48px)',
            fontWeight: '700',
            marginBottom: '24px'
          }
        }, '🏢 Real Enterprise Failures'),
        React.createElement('p', {
          style: {
            color: '#94a3b8',
            fontSize: '20px',
            maxWidth: '800px',
            margin: '0 auto 48px auto'
          }
        }, 'See exactly how our platform debugs real AI agent failures at top companies')
      ),

      React.createElement('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '80px'
        }
      },
        Object.entries(enterpriseScenarios).map(([key, scenario]) =>
          React.createElement('div', {
            key: key,
            style: {
              background: `linear-gradient(135deg, ${scenario.color}15, rgba(255, 255, 255, 0.05))`,
              backdropFilter: 'blur(20px)',
              border: `2px solid ${scenario.color}30`,
              borderRadius: '20px',
              padding: '32px',
              cursor: 'pointer',
              transition: 'all 0.4s ease',
              position: 'relative',
              overflow: 'hidden'
            },
            onMouseEnter: (e) => {
              e.target.style.transform = 'translateY(-12px) scale(1.02)';
              e.target.style.boxShadow = `0 25px 50px ${scenario.color}40`;
            },
            onMouseLeave: (e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = 'none';
            },
            onClick: () => onSelectScenario(key)
          },
            React.createElement('div', {
              style: {
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '200%',
                height: '200%',
                background: `radial-gradient(circle, ${scenario.color}10 0%, transparent 70%)`,
                animation: 'rotate 15s linear infinite'
              }
            }),

            React.createElement('div', {
              style: { position: 'relative', zIndex: 10 }
            },
              React.createElement('div', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '20px'
                }
              },
                React.createElement('div', {
                  style: { fontSize: '40px' }
                }, scenario.logo),
                React.createElement('h3', {
                  style: {
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: '700',
                    margin: 0
                  }
                }, scenario.company)
              ),

              React.createElement('h4', {
                style: {
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  lineHeight: '1.3'
                }
              }, scenario.scenario),

              React.createElement('p', {
                style: {
                  color: '#94a3b8',
                  fontSize: '15px',
                  lineHeight: '1.5',
                  marginBottom: '20px'
                }
              }, scenario.problem),

              React.createElement('div', {
                style: {
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginBottom: '24px'
                }
              },
                React.createElement('div', {
                  style: { textAlign: 'center' }
                },
                  React.createElement('div', {
                    style: {
                      color: '#ef4444',
                      fontSize: '24px',
                      fontWeight: '800'
                    }
                  }, scenario.impact.revenue_loss ? `$${(scenario.impact.revenue_loss / 1000).toFixed(0)}K` : 
                       scenario.impact.guest_lifetime_value_lost ? `$${(scenario.impact.guest_lifetime_value_lost / 1000).toFixed(0)}K` : 
                       'Critical'),
                  React.createElement('div', {
                    style: {
                      color: '#fca5a5',
                      fontSize: '12px',
                      fontWeight: '600'
                    }
                  }, 'Impact')
                ),
                React.createElement('div', {
                  style: { textAlign: 'center' }
                },
                  React.createElement('div', {
                    style: {
                      color: scenario.color,
                      fontSize: '24px',
                      fontWeight: '800'
                    }
                  }, scenario.agent_flow.length),
                  React.createElement('div', {
                    style: {
                      color: '#94a3b8',
                      fontSize: '12px',
                      fontWeight: '600'
                    }
                  }, 'Agent Steps')
                )
              ),

              React.createElement('div', {
                style: {
                  background: `${scenario.color}20`,
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center',
                  border: `1px solid ${scenario.color}40`
                }
              },
                React.createElement('div', {
                  style: {
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }
                }, '🎯 Click to Debug'),
                React.createElement('div', {
                  style: {
                    color: '#94a3b8',
                    fontSize: '12px'
                  }
                }, 'See step-by-step failure analysis →')
              )
            )
          )
        )
      ),

      // Competitive differentiation
      React.createElement('div', {
        style: {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '48px',
          marginBottom: '60px'
        }
      },
        React.createElement('h2', {
          style: {
            textAlign: 'center',
            color: 'white',
            fontSize: 'clamp(28px, 6vw, 40px)',
            fontWeight: '700',
            marginBottom: '48px'
          }
        }, '⚔️ How We Crush The Competition'),

        React.createElement('div', {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }
        },
          Object.entries(competitorData).map(([tool, features]) =>
            React.createElement('div', {
              key: tool,
              style: {
                background: tool === 'Our Solution' ? 
                  'linear-gradient(135deg, #10b981, #059669)' :
                  'rgba(255, 255, 255, 0.05)',
                border: tool === 'Our Solution' ? 
                  '2px solid #10b981' : 
                  '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center'
              }
            },
              React.createElement('h3', {
                style: {
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '700',
                  marginBottom: '16px'
                }
              }, tool),

              React.createElement('div', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }
              },
                React.createElement('div', {
                  style: {
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: `conic-gradient(${tool === 'Our Solution' ? '#10b981' : '#ef4444'} ${features.score * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: 'white'
                  }
                }, `${features.score}%`)
              ),

              React.createElement('div', {
                style: { fontSize: '12px', color: '#94a3b8' }
              },
                ['Decision Flow Viz', 'Business Impact', 'Multi-Agent Debug', 'Root Cause AI'].map((feature, idx) =>
                  React.createElement('div', {
                    key: idx,
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '4px'
                    }
                  },
                    React.createElement('span', null, feature),
                    React.createElement('span', null, 
                      Object.values(features)[idx] ? '✅' : '❌'
                    )
                  )
                )
              )
            )
          )
        ),

        React.createElement('div', {
          style: {
            textAlign: 'center',
            background: 'linear-gradient(45deg, #10b981, #059669)',
            padding: '24px',
            borderRadius: '16px',
            color: 'white'
          }
        },
          React.createElement('h3', {
            style: {
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '8px'
            }
          }, '🚀 The Only Platform That Shows WHY Agents Fail'),
          React.createElement('p', {
            style: {
              fontSize: '16px',
              margin: 0,
              opacity: 0.9
            }
          }, 'While others show metrics, we show the exact decision logic that went wrong')
        )
      )
    ),

    React.createElement('style', null, `
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.1); }
      }
      
      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      @keyframes slide {
        from { transform: translateX(-100px); }
        to { transform: translateX(100px); }
      }
    `)
  );
};

// Enhanced guided demo with step-by-step narrative
const GuidedDemo = ({ scenario, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNarrative, setShowNarrative] = useState(true);
  const [narrativeIndex, setNarrativeIndex] = useState(0);

  const narratives = [
    {
      title: "🎯 Setting The Scene",
      content: `At ${scenario.company}, their AI agent handles critical operations. ${scenario.business_context}`,
      duration: 4000
    },
    {
      title: "❓ The Problem",
      content: `Here's what went wrong: ${scenario.problem}`,
      duration: 3000
    },
    {
      title: "🔍 Why Existing Tools Failed",
      content: scenario.why_existing_tools_failed,
      duration: 3000
    },
    {
      title: "💡 Our Solution",
      content: scenario.our_solution,
      duration: 3000
    },
    {
      title: "🚀 Let's Debug Step-by-Step",
      content: "Watch as we trace through the agent's decision-making process to find the exact failure point...",
      duration: 3000
    }
  ];

  useEffect(() => {
    if (isPlaying && showNarrative) {
      if (narrativeIndex < narratives.length) {
        const timer = setTimeout(() => {
          setNarrativeIndex(prev => prev + 1);
        }, narratives[narrativeIndex].duration);
        return () => clearTimeout(timer);
      } else {
        setShowNarrative(false);
        setCurrentStep(0);
      }
    }
  }, [isPlaying, showNarrative, narrativeIndex]);

  useEffect(() => {
    if (isPlaying && !showNarrative && currentStep < scenario.agent_flow.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 4000);
      return () => clearTimeout(timer);
    } else if (!showNarrative && currentStep >= scenario.agent_flow.length && isPlaying) {
      setTimeout(onComplete, 2000);
    }
  }, [currentStep, isPlaying, showNarrative]);

  const startDemo = () => {
    setIsPlaying(true);
    setNarrativeIndex(0);
    setShowNarrative(true);
  };

  return React.createElement('div', {
    style: {
      background: `linear-gradient(135deg, ${scenario.color}10 0%, #0f172a 100%)`,
      minHeight: '100vh',
      padding: '20px'
    }
  },
    React.createElement('div', {
      style: { maxWidth: '1400px', margin: '0 auto' }
    },
      // Header
      React.createElement('div', {
        style: {
          textAlign: 'center',
          marginBottom: '40px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '32px'
        }
      },
        React.createElement('div', {
          style: { fontSize: '56px', marginBottom: '16px' }
        }, scenario.logo),
        React.createElement('h1', {
          style: {
            color: 'white',
            fontSize: 'clamp(24px, 5vw, 36px)',
            fontWeight: '700',
            marginBottom: '12px'
          }
        }, `${scenario.company} AI Agent Failure Analysis`),
        React.createElement('p', {
          style: {
            color: '#94a3b8',
            fontSize: '18px',
            maxWidth: '600px',
            margin: '0 auto'
          }
        }, scenario.scenario),

        !isPlaying && React.createElement('button', {
          style: {
            marginTop: '24px',
            background: `linear-gradient(45deg, ${scenario.color}, ${scenario.color}dd)`,
            color: 'white',
            border: 'none',
            padding: '20px 40px',
            borderRadius: '16px',
            fontSize: '18px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: `0 8px 25px ${scenario.color}40`,
            transition: 'all 0.3s ease'
          },
          onMouseEnter: (e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = `0 12px 35px ${scenario.color}60`;
          },
          onMouseLeave: (e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = `0 8px 25px ${scenario.color}40`;
          },
          onClick: startDemo
        }, '▶️ Start Guided Analysis')
      ),

      // Narrative overlay
      showNarrative && isPlaying && React.createElement('div', {
        style: {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '24px',
          padding: '48px',
          maxWidth: '600px',
          textAlign: 'center',
          zIndex: 1000
        }
      },
        React.createElement('h2', {
          style: {
            color: 'white',
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '24px'
          }
        }, narratives[narrativeIndex]?.title),
        React.createElement('p', {
          style: {
            color: '#94a3b8',
            fontSize: '18px',
            lineHeight: '1.6',
            marginBottom: '24px'
          }
        }, narratives[narrativeIndex]?.content),
        React.createElement(ProgressBar, {
          progress: ((narrativeIndex + 1) / narratives.length) * 100,
          color: scenario.color
        })
      ),

      // Main content
      !showNarrative && React.createElement('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gap: '32px'
        }
      },
        // Flow visualization
        React.createElement('div', {
          style: {
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '32px'
          }
        },
          React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '32px'
            }
          },
            React.createElement('h2', {
              style: {
                color: 'white',
                fontSize: '28px',
                fontWeight: '700',
                margin: 0
              }
            }, '🔍 Agent Decision Flow'),
            isPlaying && React.createElement('div', {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(239, 68, 68, 0.2)',
                padding: '8px 16px',
                borderRadius: '20px'
              }
            },
              React.createElement(PulsingDot, { color: '#ef4444' }),
              React.createElement('span', {
                style: { color: '#fca5a5', fontSize: '14px', fontWeight: '600' }
              }, 'ANALYZING...')
            )
          ),

          React.createElement('div', {
            style: { position: 'relative' }
          },
            scenario.agent_flow.map((step, index) =>
              React.createElement('div', {
                key: index,
                style: {
                  background: currentStep === index ? `${scenario.color}20` :
                            currentStep > index ? (step.status === 'failure' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)') :
                            'rgba(255, 255, 255, 0.03)',
                  border: currentStep === index ? `2px solid ${scenario.color}` :
                         currentStep > index ? (step.status === 'failure' ? '2px solid #ef4444' : '2px solid #10b981') :
                         '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '24px',
                  margin: '16px 0',
                  transition: 'all 0.6s ease',
                  opacity: currentStep >= index ? 1 : 0.3,
                  transform: currentStep === index ? 'scale(1.02)' : 'scale(1)'
                }
              },
                React.createElement('div', {
                  style: { display: 'flex', alignItems: 'flex-start', gap: '20px' }
                },
                  React.createElement('div', {
                    style: {
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: currentStep > index ? (step.status === 'failure' ? '#ef4444' : '#10b981') :
                                 currentStep === index ? scenario.color : '#64748b',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: '700',
                      flexShrink: 0
                    }
                  }, step.step),

                  React.createElement('div', { style: { flex: 1 } },
                    React.createElement('div', {
                      style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px'
                      }
                    },
                      React.createElement('h3', {
                        style: {
                          color: 'white',
                          fontSize: '20px',
                          fontWeight: '600',
                          margin: 0
                        }
                      }, step.title),
                      currentStep >= index && React.createElement('div', {
                        style: {
                          background: step.status === 'failure' ? '#ef4444' :
                                     step.status === 'success' ? '#10b981' : '#f59e0b',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }
                      }, step.status.toUpperCase())
                    ),

                    React.createElement('p', {
                      style: {
                        color: '#94a3b8',
                        fontSize: '14px',
                        marginBottom: '16px',
                        lineHeight: '1.5'
                      }
                    }, step.description),

                    currentStep >= index && React.createElement('div', null,
                      React.createElement('div', {
                        style: {
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '16px',
                          marginBottom: '16px'
                        }
                      },
                        React.createElement('div', {
                          style: {
                            background: 'rgba(0, 0, 0, 0.3)',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }
                        },
                          React.createElement('div', {
                            style: {
                              color: '#94a3b8',
                              fontSize: '10px',
                              fontWeight: '600',
                              marginBottom: '4px'
                            }
                          }, 'INPUT'),
                          React.createElement('div', {
                            style: {
                              color: '#e2e8f0',
                              fontSize: '13px',
                              fontFamily: 'Monaco, monospace'
                            }
                          }, step.input)
                        ),
                        React.createElement('div', {
                          style: {
                            background: 'rgba(0, 0, 0, 0.3)',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }
                        },
                          React.createElement('div', {
                            style: {
                              color: '#94a3b8',
                              fontSize: '10px',
                              fontWeight: '600',
                              marginBottom: '4px'
                            }
                          }, 'DECISION'),
                          React.createElement('div', {
                            style: {
                              color: step.status === 'failure' ? '#fca5a5' : 
                                     step.status === 'success' ? '#86efac' : '#fde68a',
                              fontSize: '13px',
                              fontFamily: 'Monaco, monospace',
                              fontWeight: '600'
                            }
                          }, step.decision)
                        )
                      ),

                      step.status === 'failure' && step.what_should_have_happened && React.createElement('div', {
                        style: {
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '12px',
                          padding: '16px',
                          marginTop: '16px'
                        }
                      },
                        React.createElement('div', {
                          style: {
                            color: '#fca5a5',
                            fontSize: '14px',
                            fontWeight: '600',
                            marginBottom: '8px'
                          }
                        }, '🚨 ROOT CAUSE IDENTIFIED'),
                        React.createElement('div', {
                          style: {
                            color: '#fecaca',
                            fontSize: '13px',
                            lineHeight: '1.4',
                            marginBottom: '12px'
                          }
                        }, step.reasoning),
                        React.createElement('div', {
                          style: {
                            background: 'rgba(16, 185, 129, 0.2)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '8px',
                            padding: '12px'
                          }
                        },
                          React.createElement('div', {
                            style: {
                              color: '#6ee7b7',
                              fontSize: '12px',
                              fontWeight: '600',
                              marginBottom: '4px'
                            }
                          }, '💡 SHOULD HAVE BEEN:'),
                          React.createElement('div', {
                            style: {
                              color: '#a7f3d0',
                              fontSize: '13px',
                              fontFamily: 'Monaco, monospace'
                            }
                          }, step.what_should_have_happened)
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
        React.createElement('div', null,
          React.createElement('div', {
            style: {
              background: 'rgba(239, 68, 68, 0.1)',
              border: '2px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '24px'
            }
          },
            React.createElement('h3', {
              style: {
                color: '#fca5a5',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '20px',
                textAlign: 'center'
              }
            }, '💸 Business Impact'),
            React.createElement('div', {
              style: { display: 'grid', gap: '16px' }
            },
              Object.entries(scenario.impact).map(([key, value]) =>
                React.createElement('div', {
                  key: key,
                  style: {
                    textAlign: 'center',
                    background: 'rgba(0, 0, 0, 0.3)',
                    padding: '16px',
                    borderRadius: '12px'
                  }
                },
                  React.createElement('div', {
                    style: {
                      color: '#ef4444',
                      fontSize: '24px',
                      fontWeight: '800',
                      marginBottom: '4px'
                    }
                  }, typeof value === 'number' ? 
                       (value > 1000 ? `$${(value/1000).toFixed(0)}K` : value) : 
                       value.toString()),
                  React.createElement('div', {
                    style: {
                      color: '#fca5a5',
                      fontSize: '11px',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }
                  }, key.replace(/_/g, ' '))
                )
              )
            )
          ),

          currentStep >= scenario.agent_flow.length && React.createElement('div', {
            style: {
              background: 'rgba(16, 185, 129, 0.1)',
              border: '2px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '20px',
              padding: '24px'
            }
          },
            React.createElement('h3', {
              style: {
                color: '#6ee7b7',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
                textAlign: 'center'
              }
            }, '🛠️ AI-Generated Fix'),
            React.createElement('p', {
              style: {
                color: '#a7f3d0',
                fontSize: '14px',
                lineHeight: '1.5',
                marginBottom: '16px'
              }
            }, scenario.fix),
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(16, 185, 129, 0.2)',
                padding: '12px',
                borderRadius: '12px'
              }
            },
              React.createElement('span', {
                style: {
                  color: '#6ee7b7',
                  fontSize: '12px',
                  fontWeight: '600'
                }
              }, 'Prevention Confidence'),
              React.createElement('span', {
                style: {
                  color: '#10b981',
                  fontSize: '20px',
                  fontWeight: '800'
                }
              }, scenario.prevention_confidence)
            )
          )
        )
      )
    )
  );
};

// Results page with clear value demonstration
const ResultsPage = ({ scenario, onBackToHome }) => {
  return React.createElement('div', {
    style: {
      background: `linear-gradient(135deg, #10b981 0%, #059669 50%, #064e3b 100%)`,
      minHeight: '100vh',
      padding: '40px 20px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }
  },
    React.createElement('div', {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)
        `
      }
    }),

    React.createElement('div', {
      style: {
        position: 'relative',
        zIndex: 10,
        maxWidth: '1000px',
        margin: '0 auto'
      }
    },
      React.createElement('div', {
        style: { fontSize: '80px', marginBottom: '32px' }
      }, '🎉'),

      React.createElement('h1', {
        style: {
          color: 'white',
          fontSize: 'clamp(32px, 8vw, 56px)',
          fontWeight: '800',
          marginBottom: '24px',
          textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
        }
      }, 'Mission Accomplished!'),

      React.createElement('p', {
        style: {
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: 'clamp(18px, 4vw, 24px)',
          marginBottom: '48px',
          lineHeight: '1.5',
          maxWidth: '800px',
          margin: '0 auto 48px auto'
        }
      }, `You've seen how our AI Agent Flow Visualizer identified the exact failure point in ${scenario.company}'s system and provided an actionable fix with ${scenario.prevention_confidence} confidence. This is what "debugging AI agents" really means.`),

      React.createElement('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '32px',
          marginBottom: '64px'
        }
      },
        React.createElement('div', {
          style: {
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }
        },
          React.createElement('div', {
            style: { fontSize: '40px', marginBottom: '16px' }
          }, '💰'),
          React.createElement('h3', {
            style: {
              color: 'white',
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '12px'
            }
          }, 'Future Losses Prevented'),
          React.createElement('p', {
            style: {
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              lineHeight: '1.5'
            }
          }, `Implementing our fix prevents ${scenario.impact.revenue_loss?.toLocaleString() || scenario.impact.guest_lifetime_value_lost?.toLocaleString() || '50,000'} in future similar failures`)
        ),

        React.createElement('div', {
          style: {
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }
        },
          React.createElement('div', {
            style: { fontSize: '40px', marginBottom: '16px' }
          }, '🤖'),
          React.createElement('h3', {
            style: {
              color: 'white',
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '12px'
            }
          }, 'AI-Validated Solution'),
          React.createElement('p', {
            style: {
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              lineHeight: '1.5'
            }
          }, `${scenario.prevention_confidence} confidence in fix effectiveness based on similar patterns`)
        )
      ),

      React.createElement('div', {
        style: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '48px',
          marginBottom: '48px',
          border: '2px solid rgba(255, 255, 255, 0.2)'
        }
      },
        React.createElement('h2', {
          style: {
            color: 'white',
            fontSize: 'clamp(24px, 5vw, 32px)',
            fontWeight: '700',
            marginBottom: '32px'
          }
        }, '🚀 What Makes This Revolutionary'),

        React.createElement('div', {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            textAlign: 'left'
          }
        },
          React.createElement('div', null,
            React.createElement('h3', {
              style: {
                color: 'white',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }
            },
              React.createElement('span', null, '❌'),
              'Traditional Tools'
            ),
            React.createElement('ul', {
              style: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                lineHeight: '1.6',
                paddingLeft: '20px',
                margin: 0
              }
            },
              React.createElement('li', null, 'Show response times (2.3s)'),
              React.createElement('li', null, 'Show error rates (12%)'),
              React.createElement('li', null, 'Show agent calls (47)'),
              React.createElement('li', null, 'Status: Failed ❌'),
              React.createElement('li', { style: { fontWeight: '600', color: '#fca5a5' } }, 'No insight into WHY it failed')
            )
          ),

          React.createElement('div', null,
            React.createElement('h3', {
              style: {
                color: 'white',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }
            },
              React.createElement('span', null, '✅'),
              'Our Platform'
            ),
            React.createElement('ul', {
              style: {
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '14px',
                lineHeight: '1.6',
                paddingLeft: '20px',
                margin: 0
              }
            },
              React.createElement('li', null, 'Agent skipped integration tests'),
              React.createElement('li', null, 'Missing conditional logic identified'),
              React.createElement('li', null, 'Decision tree gap located'),
              React.createElement('li', null, 'Fix: Add IF database_change THEN test'),
              React.createElement('li', { style: { fontWeight: '700', color: '#ffffff' } }, `${scenario.prevention_confidence} confidence in prevention`)
            )
          )
        ),

        React.createElement('div', {
          style: {
            marginTop: '32px',
            padding: '24px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            textAlign: 'center'
          }
        },
          React.createElement('h3', {
            style: {
              color: 'white',
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '8px'
            }
          }, '⚡ The Bottom Line'),
          React.createElement('p', {
            style: {
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '16px',
              margin: 0,
              fontWeight: '500'
            }
          }, 'We turn 14-hour debugging marathons into 2-minute root cause discoveries')
        )
      ),

      React.createElement('div', {
        style: {
          display: 'flex',
          gap: '24px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }
      },
        React.createElement('button', {
          style: {
            padding: '18px 36px',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '16px',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textDecoration: 'none',
            display: 'inline-block'
          },
          onMouseEnter: (e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
            e.target.style.transform = 'scale(1.05)';
          },
          onMouseLeave: (e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.transform = 'scale(1)';
          },
          onClick: onBackToHome
        }, '← Try Another Company'),

        React.createElement('a', {
          href: 'https://linkedin.com/in/yourname',
          target: '_blank',
          style: {
            padding: '18px 36px',
            background: 'linear-gradient(45deg, #ffffff, #f8fafc)',
            border: 'none',
            borderRadius: '16px',
            color: '#1e293b',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textDecoration: 'none',
            display: 'inline-block',
            boxShadow: '0 8px 25px rgba(255, 255, 255, 0.3)'
          },
          onMouseEnter: (e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 12px 35px rgba(255, 255, 255, 0.4)';
          },
          onMouseLeave: (e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 8px 25px rgba(255, 255, 255, 0.3)';
          }
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
        overflow-x: hidden;
        background: #0f172a;
        scroll-behavior: smooth;
      }
      
      * {
        box-sizing: border-box;
      }
      
      @media (max-width: 1024px) {
        .demo-grid {
          grid-template-columns: 1fr !important;
          gap: 24px !important;
        }
        
        .competitive-grid {
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important;
        }
      }
      
      @media (max-width: 768px) {
        .company-grid {
          grid-template-columns: 1fr !important;
          gap: 20px !important;
        }
        
        .results-grid {
          grid-template-columns: 1fr !important;
          gap: 20px !important;
        }
        
        h1 {
          font-size: clamp(32px, 8vw, 48px) !important;
        }
      }
      
      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 10px;
      }
      
      ::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 5px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(45deg, #3b82f6, #8b5cf6);
        border-radius: 5px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(45deg, #2563eb, #7c3aed);
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
root.render(React.createElement(App));20px)',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }
        },
          React.createElement('div', {
            style: { fontSize: '40px', marginBottom: '16px' }
          }, '🎯'),
          React.createElement('h3', {
            style: {
              color: 'white',
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '12px'
            }
          }, 'Root Cause Found'),
          React.createElement('p', {
            style: {
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              lineHeight: '1.5'
            }
          }, 'Identified exact decision logic failure that caused the incident')
        ),

        React.createElement('div', {
          style: {
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(
