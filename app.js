const { useState, useEffect } = React;

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
    impact: {
      revenue_loss: 127000,
      downtime_minutes: 360,
      customers_affected: 15000,
      sla_violations: 3
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
        business_impact: 'Standard validation - prevents basic deployment failures'
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
        business_impact: 'Prevents security incidents - estimated $2M+ in breach costs avoided'
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
        root_cause: 'Missing conditional logic for database change detection',
        what_should_have_happened: 'Run integration tests for any database schema modifications'
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
        business_impact: '6 hours downtime, 15K customers affected, emergency response team activated'
      }
    ],
    fix_recommendation: 'Add mandatory integration test checkpoint for database schema changes',
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
      transaction_volume: '1M+ per hour'
    },
    impact: {
      transaction_blocked: 50000,
      merchant_escalation: true,
      false_positive_rate: 12,
      processing_delay: 5000
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
        confidence: 89
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
        confidence: 94
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
        output: '❌ TRANSACTION BLOCKED - Conflicting agent scores (0.15 vs 0.87)',
        status: 'failure',
        duration: 5000,
        confidence: 0,
        reasoning: 'No weighted consensus mechanism for conflicting agent decisions',
        root_cause: 'Missing orchestration layer for multi-agent decision reconciliation',
        what_should_have_happened: 'Implement weighted consensus: (0.15×0.3) + (0.12×0.3) + (0.87×0.2) + (0.23×0.2) = 0.31 → APPROVE'
      }
    ],
    fix_recommendation: 'Implement weighted consensus algorithm for multi-agent decisions',
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
      daily_prs: '500K+ pull requests'
    },
    impact: {
      secrets_exposed: 3,
      repositories_affected: 12,
      security_incident: true,
      compliance_violation: true
    },
    agent_flow: [
      {
        step: 1,
        title: 'Secret Pattern Detection',
        description: 'Agent scans all PR files using regex patterns to identify potential hardcoded secrets.',
        tool: 'secret_scanner_enterprise',
        input: 'pr_files: 14 changed files, scanning for: API_KEY, SECRET, TOKEN patterns',
        decision_logic: 'IF secret_pattern_found THEN flag_for_validation',
        output: '✅ Found 3 potential secrets: [sk_live_..., pk_test_..., api_key_example]',
        status: 'success',
        duration: 180,
        confidence: 97
      },
      {
        step: 2,
        title: 'Secret Context Validation',
        description: 'CRITICAL FAILURE: Agent should validate whether detected patterns are real secrets vs test/dummy values.',
        tool: 'context_validator_v3',
        input: 'detected_secrets: ["sk_live_1234...", "pk_test_5678...", "api_key_example"]',
        decision_logic: 'BROKEN: assumed all detected patterns are violations',
        correct_logic: 'SHOULD BE: IF secret_format_real AND not_in_test_context THEN flag_as_violation',
        output: '⚠️ Context validation BYPASSED - All patterns assumed to be violations',
        status: 'failure',
        duration: 0,
        confidence: 0,
        reasoning: 'Agent lacks logic to distinguish real secrets from test/example values',
        root_cause: 'Missing secret validation and context analysis capabilities',
        what_should_have_happened: 'sk_live_* = PRODUCTION (BLOCK), pk_test_* = TEST (ALLOW), api_key_example = DUMMY (ALLOW)'
      }
    ],
    fix_recommendation: 'Implement context-aware secret validation before approval',
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
      vip_ltv: '$47,000 average'
    },
    impact: {
      guest_lifetime_value_lost: 47000,
      booking_value: 8500,
      vip_status_downgrade: true,
      negative_review: true
    },
    agent_flow: [
      {
        step: 1,
        title: 'Cancellation Request Intake',
        description: 'Agent processes incoming cancellation request and validates booking details.',
        tool: 'booking_management_system',
        input: 'booking_BK789456: {guest: premium_001, value: $8,500, checkin: 7_days}',
        decision_logic: 'IF booking_valid AND within_cancellation_window THEN process_request',
        output: '✅ Cancellation request validated - Booking confirmed, guest verified',
        status: 'success',
        duration: 340,
        confidence: 99
      },
      {
        step: 2,
        title: 'VIP Guest Status Evaluation',
        description: 'CRITICAL FAILURE: Agent should evaluate guest tier and apply VIP escalation protocols.',
        context: 'This is where the system failed - VIP status check was completely bypassed.',
        tool: 'guest_tier_analyzer',
        input: 'guest_premium_001: {lifetime_bookings: $340K, tier: VIP_PLUS, properties_stayed: 47}',
        decision_logic: 'MISSING: VIP tier evaluation not integrated into cancellation workflow',
        correct_logic: 'SHOULD BE: IF guest_tier >= VIP THEN escalate_to_specialist + retention_protocol',
        output: '⚠️ VIP status check BYPASSED - Guest tier evaluation missing from workflow',
        status: 'failure',
        duration: 0,
        confidence: 0,
        reasoning: 'Cancellation workflow lacks integration with guest tier system',
        root_cause: 'Guest tier evaluation missing from automated cancellation decision tree',
        what_should_have_happened: 'VIP_PLUS tier should trigger: specialist escalation + full refund option + retention incentives'
      }
    ],
    fix_recommendation: 'Integrate guest tier evaluation into all cancellation workflows',
    prevention_confidence: 88
  }
};

// Professional UI Components with inline styles
const ProfessionalButton = ({ children, variant = 'primary', size = 'md', onClick, style = {} }) => {
  const baseStyle = {
    fontFamily: 'Inter, sans-serif',
    fontWeight: '600',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none'
  };

  const variants = {
    primary: {
      backgroundColor: '#3b82f6',
      color: 'white',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    secondary: {
      backgroundColor: 'white',
      color: '#374151',
      border: '1px solid #d1d5db',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    cta: {
      background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
    }
  };

  const sizes = {
    sm: { padding: '6px 12px', fontSize: '14px' },
    md: { padding: '8px 16px', fontSize: '14px' },
    lg: { padding: '12px 24px', fontSize: '16px' },
    xl: { padding: '16px 32px', fontSize: '18px' }
  };

  return React.createElement('button', {
    style: { ...baseStyle, ...variants[variant], ...sizes[size], ...style },
    onClick: onClick,
    onMouseEnter: (e) => {
      if (variant === 'cta') {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
      } else {
        e.target.style.backgroundColor = variant === 'primary' ? '#2563eb' : '#f9fafb';
      }
    },
    onMouseLeave: (e) => {
      e.target.style.transform = 'translateY(0)';
      e.target.style.backgroundColor = variants[variant].backgroundColor || variants[variant].background;
      e.target.style.boxShadow = variants[variant].boxShadow;
    }
  }, children);
};

const ProfessionalCard = ({ children, style = {}, hover = false, onClick }) => {
  const cardStyle = {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    ...style
  };

  return React.createElement('div', {
    style: cardStyle,
    onClick: onClick,
    onMouseEnter: hover ? (e) => {
      e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
      e.target.style.transform = 'translateY(-4px)';
    } : undefined,
    onMouseLeave: hover ? (e) => {
      e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
      e.target.style.transform = 'translateY(0)';
    } : undefined
  }, children);
};

const StatusBadge = ({ status, confidence }) => {
  const styles = {
    success: { backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' },
    failure: { backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' },
    warning: { backgroundColor: '#fef3c7', color: '#d97706', border: '1px solid #fed7aa' }
  };

  const style = styles[status] || styles.warning;

  return React.createElement('div', {
    style: {
      ...style,
      padding: '4px 12px',
      borderRadius: '16px',
      fontSize: '12px',
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px'
    }
  },
    React.createElement('span', null, status === 'success' ? '✅' : status === 'failure' ? '❌' : '⚠️'),
    React.createElement('span', null, status.toUpperCase()),
    confidence && React.createElement('span', { style: { opacity: 0.7 } }, `${confidence}%`)
  );
};

const AnimatedCounter = ({ value, duration = 2000, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startValue = 0;
    const endValue = typeof value === 'string' ? parseFloat(value) : value;
    const increment = endValue / (duration / 16);

    const timer = setInterval(() => {
      startValue += increment;
      if (startValue >= endValue) {
        setCount(endValue);
        clearInterval(timer);
      } else {
        setCount(startValue);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  const displayValue = typeof value === 'string' && value.includes('.') ? 
    count.toFixed(1) : Math.floor(count).toLocaleString();

  return React.createElement('span', null, `${prefix}${displayValue}${suffix}`);
};

// Professional landing page
const LandingPage = ({ onSelectScenario }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return React.createElement('div', {
    style: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }
  },
    // Professional Navigation
    React.createElement('nav', {
      style: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }
    },
      React.createElement('div', {
        style: {
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }
      },
        React.createElement('div', {
          style: { display: 'flex', alignItems: 'center', gap: '12px' }
        },
          React.createElement('div', {
            style: {
              width: '32px',
              height: '32px',
              background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }
          },
            React.createElement('span', {
              style: { color: 'white', fontWeight: 'bold', fontSize: '16px' }
            }, 'A')
          ),
          React.createElement('span', {
            style: { fontSize: '20px', fontWeight: '700', color: '#1f2937' }
          }, 'AgentFlow')
        ),
        React.createElement('div', {
          style: { display: 'flex', alignItems: 'center', gap: '32px' }
        },
          ['Platform', 'Solutions', 'Resources'].map(item =>
            React.createElement('a', {
              key: item,
              href: '#',
              style: {
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280',
                textDecoration: 'none',
                transition: 'color 0.2s'
              },
              onMouseEnter: (e) => e.target.style.color = '#1f2937',
              onMouseLeave: (e) => e.target.style.color = '#6b7280'
            }, item)
          ),
          React.createElement(ProfessionalButton, {
            variant: 'cta',
            size: 'md'
          }, 'Request Demo')
        )
      )
    ),

    // Hero Section
    React.createElement('section', {
      style: {
        padding: '80px 24px',
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
            radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)
          `
        }
      }),
      React.createElement('div', {
        style: { position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto' }
      },
        React.createElement('div', {
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '20px',
            padding: '6px 16px',
            marginBottom: '32px'
          }
        },
          React.createElement('div', {
            style: {
              width: '8px',
              height: '8px',
              backgroundColor: '#ef4444',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }
          }),
          React.createElement('span', {
            style: { color: '#dc2626', fontSize: '13px', fontWeight: '600' }
          }, 'ENTERPRISE AI CRISIS')
        ),

        React.createElement('h1', {
          style: {
            fontSize: 'clamp(40px, 8vw, 64px)',
            fontWeight: '800',
            color: '#1f2937',
            marginBottom: '24px',
            lineHeight: '1.1',
            letterSpacing: '-0.02em'
          }
        },
          'Debug AI Agents',
          React.createElement('br'),
          React.createElement('span', {
            style: {
              background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }
          }, 'Like Never Before')
        ),

        React.createElement('p', {
          style: {
            fontSize: 'clamp(18px, 3vw, 22px)',
            color: '#6b7280',
            maxWidth: '800px',
            margin: '0 auto 40px auto',
            lineHeight: '1.6'
          }
        }, 'Enterprise AI agents make thousands of decisions daily. When they fail, you lose millions. Traditional tools show response times and error rates, but never answer the critical question: WHY did the agent make that decision?'),

        React.createElement('div', {
          style: {
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '60px'
          }
        },
          React.createElement(ProfessionalButton, {
            variant: 'cta',
            size: 'xl',
            onClick: () => window.scrollTo({ top: 600, behavior: 'smooth' })
          }, 'See Live Analysis →'),
          React.createElement(ProfessionalButton, {
            variant: 'secondary',
            size: 'xl'
          }, 'Schedule Demo')
        ),

        // Animated stats
        React.createElement('div', {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            maxWidth: '900px',
            margin: '0 auto'
          }
        },
          React.createElement(ProfessionalCard, {
            style: {
              padding: '32px',
              textAlign: 'center',
              borderColor: '#fecaca',
              backgroundColor: 'rgba(254, 202, 202, 0.1)'
            }
          },
            React.createElement('div', {
              style: { display: 'grid', gap: '12px' }
            },
              Object.entries(scenario.impact).slice(0, 3).map(([key, value]) =>
                React.createElement('div', {
                  key: key,
                  style: {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center'
                  }
                },
                  React.createElement('div', {
                    style: {
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#ef4444',
                      marginBottom: '4px'
                    }
                  }, typeof value === 'number' ? 
                       (value > 1000 ? `${(value/1000).toFixed(0)}K` : value.toLocaleString()) : 
                       value === true ? '✓' : value.toString()),
                  React.createElement('div', {
                    style: {
                      fontSize: '11px',
                      color: '#6b7280',
                      fontWeight: '500',
                      textTransform: 'uppercase'
                    }
                  }, key.replace(/_/g, ' '))
                )
              )
            )
          ),

          // Fix recommendation (appears at end)
          currentStep >= scenario.agent_flow.length && React.createElement(ProfessionalCard, {
            style: {
              padding: '24px',
              borderColor: '#bbf7d0',
              backgroundColor: 'rgba(187, 247, 208, 0.1)'
            }
          },
            React.createElement('h3', {
              style: {
                fontSize: '18px',
                fontWeight: '600',
                color: '#059669',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }
            },
              React.createElement('span', null, '🛠️'),
              'AI-Generated Fix'
            ),
            React.createElement('p', {
              style: {
                color: '#166534',
                fontSize: '14px',
                lineHeight: '1.5',
                marginBottom: '16px'
              }
            }, scenario.fix_recommendation),
            React.createElement('div', {
              style: {
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '8px',
                padding: '12px',
                textAlign: 'center'
              }
            },
              React.createElement('div', {
                style: {
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  marginBottom: '4px'
                }
              }, 'Prevention Confidence'),
              React.createElement('div', {
                style: {
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#10b981'
                }
              }, `${scenario.prevention_confidence}%`)
            )
          )
        )
      ),

      // Results phase
      currentPhase === 'results' && React.createElement('div', {
        style: { textAlign: 'center' }
      },
        React.createElement(ProfessionalCard, {
          style: {
            maxWidth: '800px',
            margin: '0 auto',
            padding: '48px',
            borderColor: '#bbf7d0',
            backgroundColor: 'rgba(187, 247, 208, 0.1)'
          }
        },
          React.createElement('div', {
            style: { fontSize: '64px', marginBottom: '24px' }
          }, '🎉'),
          React.createElement('h2', {
            style: {
              fontSize: '36px',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '20px'
            }
          }, 'Analysis Complete!'),
          React.createElement('p', {
            style: {
              fontSize: '18px',
              color: '#374151',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto 32px auto'
            }
          }, `Root cause identified in ${scenario.company}'s agent failure. Our platform pinpointed the exact decision logic error and provided a fix with ${scenario.prevention_confidence}% confidence.`),

          React.createElement('div', {
            style: {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '32px'
            }
          },
            React.createElement('div', {
              style: {
                padding: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '12px',
                textAlign: 'center'
              }
            },
              React.createElement('div', {
                style: { fontSize: '32px', marginBottom: '8px' }
              }, '🎯'),
              React.createElement('div', {
                style: {
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '4px'
                }
              }, 'Root Cause Found'),
              React.createElement('div', {
                style: { fontSize: '13px', color: '#6b7280' }
              }, 'Decision logic identified')
            ),
            React.createElement('div', {
              style: {
                padding: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '12px',
                textAlign: 'center'
              }
            },
              React.createElement('div', {
                style: { fontSize: '32px', marginBottom: '8px' }
              }, '💰'),
              React.createElement('div', {
                style: {
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '4px'
                }
              }, 'Losses Prevented'),
              React.createElement('div', {
                style: { fontSize: '13px', color: '#6b7280' }
              }, 'Future incidents avoided')
            ),
            React.createElement('div', {
              style: {
                padding: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '12px',
                textAlign: 'center'
              }
            },
              React.createElement('div', {
                style: { fontSize: '32px', marginBottom: '8px' }
              }, '🤖'),
              React.createElement('div', {
                style: {
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '4px'
                }
              }, 'AI-Validated'),
              React.createElement('div', {
                style: { fontSize: '13px', color: '#6b7280' }
              }, `${scenario.prevention_confidence}% confidence`)
            )
          ),

          React.createElement('div', {
            style: {
              padding: '24px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '12px',
              marginBottom: '32px'
            }
          },
            React.createElement('h3', {
              style: {
                fontSize: '18px',
                fontWeight: '600',
                color: '#059669',
                marginBottom: '8px'
              }
            }, '⚡ Key Achievement'),
            React.createElement('p', {
              style: {
                fontSize: '16px',
                color: '#047857',
                margin: 0,
                fontWeight: '500'
              }
            }, 'Turned 14-hour debugging session into 2-minute root cause discovery')
          ),

          React.createElement('div', {
            style: {
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }
          },
            React.createElement(ProfessionalButton, {
              variant: 'secondary',
              size: 'lg',
              onClick: onComplete
            }, '← Try Another Company'),
            React.createElement(ProfessionalButton, {
              variant: 'cta',
              size: 'lg'
            }, '🚀 Schedule Demo')
          )
        )
      )
    ),

    React.createElement('style', null, `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
      
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(1.05); }
      }
      
      @keyframes progress {
        from { width: 0% }
        to { width: 100% }
      }
      
      body {
        margin: 0;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
      
      * { box-sizing: border-box; }
    `)
  );
};

// Results page
const ResultsPage = ({ scenario, onBackToHome }) => {
  return React.createElement('div', {
    style: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
      padding: '40px 20px',
      fontFamily: 'Inter, sans-serif'
    }
  },
    React.createElement('div', {
      style: {
        maxWidth: '900px',
        margin: '0 auto',
        textAlign: 'center'
      }
    },
      React.createElement(ProfessionalCard, {
        style: {
          padding: '48px',
          borderColor: '#bbf7d0',
          backgroundColor: 'rgba(255, 255, 255, 0.9)'
        }
      },
        React.createElement('div', {
          style: { fontSize: '80px', marginBottom: '24px' }
        }, '🎉'),
        React.createElement('h1', {
          style: {
            fontSize: '40px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '20px'
          }
        }, 'Mission Accomplished!'),
        React.createElement('p', {
          style: {
            fontSize: '18px',
            color: '#374151',
            lineHeight: '1.6',
            marginBottom: '32px'
          }
        }, `You've seen how our platform identified the exact failure point in ${scenario.company}'s agent and provided an actionable fix with ${scenario.prevention_confidence}% confidence.`),
        
        React.createElement('div', {
          style: {
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }
        },
          React.createElement(ProfessionalButton, {
            variant: 'secondary',
            size: 'lg',
            onClick: onBackToHome
          }, '← Try Another Company'),
          React.createElement(ProfessionalButton, {
            variant: 'cta',
            size: 'lg'
          }, '🚀 Schedule Enterprise Demo')
        )
      )
    )
  );
};

// Main App component
const App = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [selectedScenario, setSelectedScenario] = useState(null);

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
                color: '#ef4444',
                marginBottom: '8px'
              }
            }, React.createElement(AnimatedCounter, { value: 67, suffix: '%' })),
            React.createElement('div', {
              style: {
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '4px'
              }
            }, 'AI Failures Untraced'),
            React.createElement('div', {
              style: {
                fontSize: '14px',
                color: '#6b7280'
              }
            }, 'to root cause')
          ),
          React.createElement(ProfessionalCard, {
            style: {
              padding: '32px',
              textAlign: 'center',
              borderColor: '#fed7aa',
              backgroundColor: 'rgba(254, 215, 170, 0.1)'
            }
          },
            React.createElement('div', {
              style: {
                fontSize: '36px',
                fontWeight: '800',
                color: '#f59e0b',
                marginBottom: '8px'
              }
            }, React.createElement(AnimatedCounter, { value: 2.3, prefix: '$', suffix: 'B' })),
            React.createElement('div', {
              style: {
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '4px'
              }
            }, 'Annual Enterprise Cost'),
            React.createElement('div', {
              style: {
                fontSize: '14px',
                color: '#6b7280'
              }
            }, 'from AI agent failures')
          ),
          React.createElement(ProfessionalCard, {
            style: {
              padding: '32px',
              textAlign: 'center',
              borderColor: '#bfdbfe',
              backgroundColor: 'rgba(191, 219, 254, 0.1)'
            }
          },
            React.createElement('div', {
              style: {
                fontSize: '36px',
                fontWeight: '800',
                color: '#3b82f6',
                marginBottom: '8px'
              }
            }, React.createElement(AnimatedCounter, { value: 14, suffix: 'h' })),
            React.createElement('div', {
              style: {
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '4px'
              }
            }, 'Average Debug Time'),
            React.createElement('div', {
              style: {
                fontSize: '14px',
                color: '#6b7280'
              }
            }, 'per incident')
          )
        )
      )
    ),

    // Problem/Solution Section
    React.createElement('section', {
      style: {
        padding: '80px 24px',
        backgroundColor: 'white'
      }
    },
      React.createElement('div', {
        style: { maxWidth: '1400px', margin: '0 auto' }
      },
        React.createElement('div', {
          style: { textAlign: 'center', marginBottom: '64px' }
        },
          React.createElement('h2', {
            style: {
              fontSize: 'clamp(32px, 6vw, 48px)',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '24px'
            }
          }, 'The Hidden Crisis in AI Operations'),
          React.createElement('p', {
            style: {
              fontSize: '20px',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }
          }, 'Existing tools show you WHAT failed. We show you WHY it failed.')
        ),

        React.createElement('div', {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '48px'
          }
        },
          // Traditional tools
          React.createElement(ProfessionalCard, {
            style: {
              padding: '40px',
              borderColor: '#fecaca',
              background: 'linear-gradient(135deg, rgba(254, 202, 202, 0.1), rgba(252, 165, 165, 0.05))'
            }
          },
            React.createElement('div', {
              style: { textAlign: 'center', marginBottom: '32px' }
            },
              React.createElement('div', {
                style: {
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#fee2e2',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto'
                }
              },
                React.createElement('span', { style: { fontSize: '24px' } }, '❌')
              ),
              React.createElement('h3', {
                style: {
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1f2937',
                  marginBottom: '8px'
                }
              }, 'Traditional Tools'),
              React.createElement('p', {
                style: { color: '#6b7280', fontSize: '16px' }
              }, 'Show surface-level metrics')
            ),
            React.createElement('div', {
              style: { display: 'grid', gap: '12px' }
            },
              ['Response Time: 2.3s', 'Error Rate: 12%', 'Agent Calls: 47', 'Status: Failed'].map((metric, idx) =>
                React.createElement('div', {
                  key: idx,
                  style: {
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    padding: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }
                },
                  React.createElement('span', {
                    style: { fontSize: '14px', fontWeight: '500', color: '#374151' }
                  }, metric.split(':')[0]),
                  React.createElement('span', {
                    style: { fontSize: '14px', fontWeight: '600', color: '#dc2626' }
                  }, metric.split(':')[1] || 'Failed')
                )
              )
            ),
            React.createElement('div', {
              style: {
                marginTop: '16px',
                padding: '16px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '8px',
                textAlign: 'center'
              }
            },
              React.createElement('p', {
                style: { fontSize: '14px', fontWeight: '600', color: '#dc2626', margin: 0 }
              }, '❓ No insight into WHY it failed')
            )
          ),

          // Our solution
          React.createElement(ProfessionalCard, {
            style: {
              padding: '40px',
              borderColor: '#bbf7d0',
              background: 'linear-gradient(135deg, rgba(187, 247, 208, 0.1), rgba(134, 239, 172, 0.05))'
            }
          },
            React.createElement('div', {
              style: { textAlign: 'center', marginBottom: '32px' }
            },
              React.createElement('div', {
                style: {
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#dcfce7',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto'
                }
              },
                React.createElement('span', { style: { fontSize: '24px' } }, '✅')
              ),
              React.createElement('h3', {
                style: {
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1f2937',
                  marginBottom: '8px'
                }
              }, 'AgentFlow Platform'),
              React.createElement('p', {
                style: { color: '#6b7280', fontSize: '16px' }
              }, 'Shows exact decision logic failures')
            ),
            React.createElement('div', {
              style: { display: 'grid', gap: '12px' }
            },
              [
                { label: 'Root Cause', value: 'Agent skipped integration tests' },
                { label: 'Missing Logic', value: 'IF database_change THEN test' },
                { label: 'Business Impact', value: '$127K loss prevented' },
                { label: 'Fix Confidence', value: '96%' }
              ].map((item, idx) =>
                React.createElement('div', {
                  key: idx,
                  style: {
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px',
                    padding: '12px'
                  }
                },
                  React.createElement('div', {
                    style: { fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }
                  }, item.label),
                  React.createElement('div', {
                    style: { 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      color: '#059669',
                      fontFamily: item.label === 'Missing Logic' ? 'Monaco, monospace' : 'inherit'
                    }
                  }, item.value)
                )
              )
            ),
            React.createElement('div', {
              style: {
                marginTop: '16px',
                padding: '16px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '8px',
                textAlign: 'center'
              }
            },
              React.createElement('p', {
                style: { fontSize: '14px', fontWeight: '600', color: '#059669', margin: 0 }
              }, '⚡ 14-hour debug → 2-minute fix')
            )
          )
        )
      )
    ),

    // Company Scenarios
    React.createElement('section', {
      style: {
        padding: '80px 24px',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }
    },
      React.createElement('div', {
        style: { maxWidth: '1400px', margin: '0 auto' }
      },
        React.createElement('div', {
          style: { textAlign: 'center', marginBottom: '64px' }
        },
          React.createElement('h2', {
            style: {
              fontSize: 'clamp(32px, 6vw, 44px)',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '24px'
            }
          }, '🏢 Real Enterprise Failures Analyzed'),
          React.createElement('p', {
            style: {
              fontSize: '20px',
              color: '#6b7280',
              maxWidth: '700px',
              margin: '0 auto'
            }
          }, 'See exactly how our platform debugs AI agent failures at top companies')
        ),

        React.createElement('div', {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }
        },
          Object.entries(enterpriseScenarios).map(([key, scenario]) =>
            React.createElement(ProfessionalCard, {
              key: key,
              style: {
                padding: '32px',
                cursor: 'pointer',
                border: '2px solid #e5e7eb',
                transition: 'all 0.3s ease'
              },
              hover: true,
              onClick: () => onSelectScenario(key)
            },
              React.createElement('div', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '20px'
                }
              },
                React.createElement('div', {
                  style: {
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: `${scenario.color}15`,
                    border: `2px solid ${scenario.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }
                }, scenario.logo),
                React.createElement('div', null,
                  React.createElement('h3', {
                    style: {
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#1f2937',
                      marginBottom: '4px'
                    }
                  }, scenario.company),
                  React.createElement('p', {
                    style: {
                      fontSize: '14px',
                      color: '#6b7280',
                      margin: 0
                    }
                  }, scenario.scenario)
                )
              ),

              React.createElement('p', {
                style: {
                  fontSize: '15px',
                  color: '#374151',
                  lineHeight: '1.5',
                  marginBottom: '20px'
                }
              }, scenario.problem),

              React.createElement('div', {
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px'
                }
              },
                React.createElement('div', {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }
                },
                  React.createElement('span', {
                    style: {
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#ef4444'
                    }
                  }, scenario.impact.revenue_loss ? `$${(scenario.impact.revenue_loss / 1000).toFixed(0)}K` : 
                       scenario.impact.guest_lifetime_value_lost ? `$${(scenario.impact.guest_lifetime_value_lost / 1000).toFixed(0)}K` :
                       scenario.impact.transaction_blocked ? `$${(scenario.impact.transaction_blocked / 1000).toFixed(0)}K` : 'Critical'),
                  React.createElement('span', {
                    style: { fontSize: '14px', color: '#6b7280' }
                  }, 'impact')
                ),
                React.createElement('div', {
                  style: {
                    padding: '4px 12px',
                    backgroundColor: '#dbeafe',
                    color: '#1d4ed8',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }
                }, `${scenario.agent_flow.length} steps`)
              ),

              React.createElement('div', {
                style: {
                  padding: '16px',
                  backgroundColor: `${scenario.color}10`,
                  border: `1px solid ${scenario.color}30`,
                  borderRadius: '12px',
                  textAlign: 'center'
                }
              },
                React.createElement('div', {
                  style: {
                    fontSize: '14px',
                    fontWeight: '600',
                    color: scenario.color
                  }
                }, '🔍 Click to Debug This Failure →')
              )
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
      content: `${scenario.company} operates at massive scale: ${scenario.business_context.scale}. Their AI systems are ${scenario.business_context.criticality}.`,
      duration: 5000
    },
    {
      title: '❗ What Went Wrong',
      content: `Here's what happened: ${scenario.problem}. Let's trace through the agent's decision-making process step by step.`,
      duration: 4000
    },
    {
      title: '🔍 Why We Need Better Tools',
      content: `Traditional monitoring missed this failure. Our platform shows the exact decision logic that went wrong.`,
      duration: 4000
    },
    {
      title: '🚀 Starting Deep Analysis',
      content: `Now let's examine each step the agent took and identify exactly where it made the wrong decision...`,
      duration: 3000
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
    style: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      fontFamily: 'Inter, sans-serif'
    }
  },
    // Navigation header
    React.createElement('div', {
      style: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }
    },
      React.createElement('div', {
        style: {
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }
      },
        React.createElement('div', {
          style: { display: 'flex', alignItems: 'center', gap: '16px' }
        },
          React.createElement('span', { style: { fontSize: '40px' } }, scenario.logo),
          React.createElement('div', null,
            React.createElement('h1', {
              style: {
                fontSize: '22px',
                fontWeight: '700',
                color: '#1f2937',
                margin: 0
              }
            }, `${scenario.company} Analysis`),
            React.createElement('p', {
              style: {
                fontSize: '14px',
                color: '#6b7280',
                margin: 0
              }
            }, scenario.scenario)
          )
        ),
        React.createElement('div', {
          style: { display: 'flex', alignItems: 'center', gap: '12px' }
        },
          React.createElement(ProfessionalButton, {
            variant: 'secondary',
            size: 'sm',
            onClick: () => window.history.back()
          }, '← Back'),
          React.createElement(ProfessionalButton, {
            variant: 'secondary',
            size: 'sm',
            onClick: () => setShowControls(!showControls)
          }, showControls ? 'Hide Controls' : 'Show Controls')
        )
      )
    ),

    // Playback controls
    showControls && React.createElement('div', {
      style: {
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '12px 24px'
      }
    },
      React.createElement('div', {
        style: {
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }
      },
        React.createElement('div', {
          style: { display: 'flex', alignItems: 'center', gap: '16px' }
        },
          React.createElement(ProfessionalButton, {
            variant: 'secondary',
            size: 'sm',
            onClick: togglePlayPause
          }, isPlaying ? '⏸️ Pause' : '▶️ Play'),
          React.createElement(ProfessionalButton, {
            variant: 'secondary',
            size: 'sm',
            onClick: restart
          }, '🔄 Restart'),
          React.createElement('div', {
            style: { display: 'flex', alignItems: 'center', gap: '8px' }
          },
            React.createElement('span', {
              style: { fontSize: '14px', color: '#6b7280' }
            }, 'Speed:'),
            React.createElement('select', {
              value: speed,
              onChange: (e) => setSpeed(Number(e.target.value)),
              style: {
                fontSize: '14px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '4px 8px',
                backgroundColor: 'white'
              }
            },
              React.createElement('option', { value: 0.5 }, '0.5x'),
              React.createElement('option', { value: 1 }, '1x'),
              React.createElement('option', { value: 1.5 }, '1.5x'),
              React.createElement('option', { value: 2 }, '2x')
            )
          )
        ),
        React.createElement('div', {
          style: { display: 'flex', alignItems: 'center', gap: '12px' }
        },
          React.createElement('span', {
            style: { fontSize: '14px', color: '#6b7280' }
          }, 
            currentPhase === 'context' ? `Context ${contextIndex + 1}/${contextPhases.length}` :
            currentPhase === 'analysis' ? `Step ${currentStep + 1}/${scenario.agent_flow.length}` :
            'Analysis Complete'
          ),
          React.createElement('div', {
            style: {
              width: '128px',
              height: '8px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              overflow: 'hidden'
            }
          },
            React.createElement('div', {
              style: {
                height: '100%',
                backgroundColor: '#3b82f6',
                borderRadius: '4px',
                transition: 'width 0.3s ease',
                width: `${
                  currentPhase === 'context' ? ((contextIndex + 1) / contextPhases.length) * 25 :
                  currentPhase === 'analysis' ? 25 + ((currentStep / scenario.agent_flow.length) * 75) :
                  100
                }%`
              }
            })
          )
        )
      )
    ),

    // Main content
    React.createElement('div', {
      style: {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '32px 24px'
      }
    },
      // Context phase
      currentPhase === 'context' && React.createElement('div', {
        style: { textAlign: 'center' }
      },
        !isPlaying && React.createElement('div', {
          style: { marginBottom: '32px' }
        },
          React.createElement(ProfessionalButton, {
            variant: 'cta',
            size: 'xl',
            onClick: () => setIsPlaying(true)
          }, '▶️ Start Guided Analysis')
        ),
        
        isPlaying && contextIndex < contextPhases.length && React.createElement(ProfessionalCard, {
          style: {
            maxWidth: '800px',
            margin: '0 auto',
            padding: '48px',
            textAlign: 'center'
          }
        },
          React.createElement('h2', {
            style: {
              fontSize: '28px',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '24px'
            }
          }, contextPhases[contextIndex].title),
          React.createElement('p', {
            style: {
              fontSize: '18px',
              color: '#374151',
              lineHeight: '1.6',
              marginBottom: '24px'
            }
          }, contextPhases[contextIndex].content),
          React.createElement('div', {
            style: {
              width: '100%',
              height: '4px',
              backgroundColor: '#e5e7eb',
              borderRadius: '2px',
              overflow: 'hidden'
            }
          },
            React.createElement('div', {
              style: {
                height: '100%',
                backgroundColor: '#3b82f6',
                borderRadius: '2px',
                animation: `progress ${contextPhases[contextIndex].duration / speed}ms linear`
              }
            })
          )
        )
      ),

      // Analysis phase
      currentPhase === 'analysis' && React.createElement('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: window.innerWidth > 1024 ? '1fr 320px' : '1fr',
          gap: '32px'
        }
      },
        // Main flow visualization
        React.createElement(ProfessionalCard, {
          style: { padding: '32px' }
        },
          React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '32px'
            }
          },
            React.createElement('h2', {
              style: {
                fontSize: '24px',
                fontWeight: '700',
                color: '#1f2937',
                margin: 0
              }
            }, '🔍 Agent Decision Flow'),
            isPlaying && React.createElement('div', {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#dc2626',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '600'
              }
            },
              React.createElement('div', {
                style: {
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#ef4444',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }
              }),
              'ANALYZING...'
            )
          ),

          React.createElement('div', {
            style: { display: 'grid', gap: '20px' }
          },
            scenario.agent_flow.map((step, index) =>
              React.createElement('div', {
                key: index,
                style: {
                  border: currentStep === index ? `2px solid ${scenario.color}` :
                         currentStep > index ? (step.status === 'failure' ? '2px solid #ef4444' : '2px solid #10b981') :
                         '1px solid #e5e7eb',
                  borderRadius: '16px',
                  padding: '24px',
                  backgroundColor: currentStep === index ? `${scenario.color}08` :
                                  currentStep > index ? (step.status === 'failure' ? '#fef2f2' : '#f0fdf4') :
                                  '#f9fafb',
                  transition: 'all 0.5s ease',
                  opacity: currentStep >= index ? 1 : 0.4,
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
                      backgroundColor: currentStep > index ? (step.status === 'failure' ? '#ef4444' : '#10b981') :
                                     currentStep === index ? scenario.color : '#9ca3af',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
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
                          fontSize: '20px',
                          fontWeight: '600',
                          color: '#1f2937',
                          margin: 0
                        }
                      }, step.title),
                      currentStep >= index && React.createElement(StatusBadge, {
                        status: step.status,
                        confidence: step.confidence
                      })
                    ),
                    
                    React.createElement('p', {
                      style: {
                        color: '#374151',
                        fontSize: '15px',
                        lineHeight: '1.5',
                        marginBottom: '16px'
                      }
                    }, step.description),

                    currentStep >= index && React.createElement('div', {
                      style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '16px',
                        marginBottom: '16px'
                      }
                    },
                      React.createElement('div', {
                        style: {
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          padding: '16px'
                        }
                      },
                        React.createElement('div', {
                          style: {
                            fontSize: '11px',
                            fontWeight: '600',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            marginBottom: '8px'
                          }
                        }, 'INPUT'),
                        React.createElement('div', {
                          style: {
                            fontSize: '13px',
                            fontFamily: 'Monaco, monospace',
                            color: '#1f2937',
                            lineHeight: '1.4'
                          }
                        }, step.input)
                      ),
                      React.createElement('div', {
                        style: {
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          padding: '16px'
                        }
                      },
                        React.createElement('div', {
                          style: {
                            fontSize: '11px',
                            fontWeight: '600',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            marginBottom: '8px'
                          }
                        }, 'DECISION LOGIC'),
                        React.createElement('div', {
                          style: {
                            fontSize: '13px',
                            fontFamily: 'Monaco, monospace',
                            color: step.status === 'failure' ? '#dc2626' : '#059669',
                            lineHeight: '1.4'
                          }
                        }, step.decision_logic)
                      )
                    ),

                    // Root cause analysis for failures
                    currentStep >= index && step.status === 'failure' && React.createElement('div', {
                      style: {
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '12px',
                        padding: '20px',
                        marginTop: '16px'
                      }
                    },
                      React.createElement('h4', {
                        style: {
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#dc2626',
                          marginBottom: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }
                      },
                        React.createElement('span', null, '🚨'),
                        'Root Cause Identified'
                      ),
                      React.createElement('p', {
                        style: {
                          color: '#b91c1c',
                          fontSize: '14px',
                          lineHeight: '1.5',
                          marginBottom: '16px'
                        }
                      }, step.reasoning),
                      step.what_should_have_happened && React.createElement('div', {
                        style: {
                          backgroundColor: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          borderRadius: '8px',
                          padding: '16px'
                        }
                      },
                        React.createElement('div', {
                          style: {
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#059669',
                            textTransform: 'uppercase',
                            marginBottom: '8px'
                          }
                        }, '💡 What Should Have Happened:'),
                        React.createElement('div', {
                          style: {
                            fontSize: '13px',
                            fontFamily: 'Monaco, monospace',
                            color: '#166534',
                            lineHeight: '1.4'
                          }
                        }, step.what_should_have_happened)
                      )
                    )
                  )
                )
              )
            )
          )
        ),

        // Side panel (only on desktop)
        window.innerWidth > 1024 && React.createElement('div', {
          style: { display: 'grid', gap: '24px' }
        },
          // Business impact
          React.createElement(ProfessionalCard, {
            style: {
              padding: '24px',
              borderColor: '#fecaca',
              backgroundColor: 'rgba(254, 202, 202, 0.1)'
            }
          },
            React.createElement('h3', {
              style: {
                fontSize: '18px',
                fontWeight: '600',
                color: '#dc2626',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }
            },
              React.createElement('span', null, '💸'),
              'Business Impact'
            ),
            React.createElement('div', {
              style:
