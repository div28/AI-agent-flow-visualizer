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
        description: 'Agent performs static analysis on database migration files.',
        tool: 'code_analyzer_v2',
        input: 'database_migration.sql (47 lines)',
        decision_logic: 'IF syntax_valid THEN proceed',
        output: '✅ Syntax validation passed',
        status: 'success',
        duration: 245,
        confidence: 99
      },
      {
        step: 2,
        title: 'Security Scan',
        description: 'Agent runs comprehensive security scans.',
        tool: 'security_scanner',
        input: 'full_codebase (12,847 files)',
        decision_logic: 'IF no_critical_issues THEN proceed',
        output: '✅ No security issues detected',
        status: 'success',
        duration: 1200,
        confidence: 95
      },
      {
        step: 3,
        title: 'Integration Test Decision',
        description: 'CRITICAL FAILURE: Agent evaluates test requirements.',
        tool: 'test_orchestrator',
        input: 'database_schema: true',
        decision_logic: 'BROKEN: IF file_count < 50 THEN skip_tests',
        correct_logic: 'SHOULD BE: IF database_changes THEN run_tests = TRUE',
        output: '⚠️ Integration tests SKIPPED',
        status: 'failure',
        duration: 0,
        confidence: 0,
        reasoning: 'Agent failed to detect database changes require testing',
        what_should_have_happened: 'Run integration tests for database modifications'
      },
      {
        step: 4,
        title: 'Production Deployment',
        description: 'Agent proceeds without proper testing.',
        tool: 'deployment_engine',
        input: 'production, tests_passed: false',
        decision_logic: 'IF previous_steps_green THEN deploy',
        output: '❌ Database connection pool exhausted',
        status: 'failure',
        duration: 30000,
        confidence: 0
      }
    ],
    fix_recommendation: 'Add mandatory integration tests for database changes',
    prevention_confidence: 96
  },
  stripe: {
    company: 'Stripe',
    logo: '💳',
    color: '#635BFF',
    scenario: 'Multi-Agent Fraud Detection Conflict',
    problem: 'Payment agents returned conflicting fraud scores',
    business_context: {
      scale: '$640B+ annual processing',
      criticality: 'Real-time payment decisions'
    },
    impact: {
      transaction_blocked: 50000,
      false_positive_rate: 12,
      merchant_escalation: true
    },
    agent_flow: [
      {
        step: 1,
        title: 'Velocity Analysis',
        description: 'Agent analyzes transaction patterns.',
        tool: 'velocity_analyzer',
        input: '$50K transaction, history: 3 txns avg $45K',
        decision_logic: 'IF velocity_normal THEN low_risk',
        output: '✅ LOW RISK (score: 0.15)',
        status: 'success',
        duration: 120,
        confidence: 89
      },
      {
        step: 2,
        title: 'Device Analysis',
        description: 'Agent verifies device fingerprint.',
        tool: 'device_intelligence',
        input: 'known_device, San Francisco CA',
        decision_logic: 'IF device_known THEN low_risk',
        output: '✅ LOW RISK (score: 0.12)',
        status: 'success',
        duration: 80,
        confidence: 94
      },
      {
        step: 3,
        title: 'Multi-Agent Coordination',
        description: 'CRITICAL FAILURE: Conflicting risk scores.',
        tool: 'agent_orchestrator',
        input: 'scores: [0.15, 0.12, 0.87, 0.23]',
        decision_logic: 'BROKEN: IF any_score > 0.8 THEN block',
        correct_logic: 'SHOULD BE: weighted_consensus algorithm',
        output: '❌ TRANSACTION BLOCKED',
        status: 'failure',
        duration: 5000,
        confidence: 0,
        reasoning: 'No consensus mechanism for conflicting decisions',
        what_should_have_happened: 'Weighted score = 0.31 → APPROVE'
      }
    ],
    fix_recommendation: 'Implement weighted consensus for multi-agent decisions',
    prevention_confidence: 91
  },
  github: {
    company: 'GitHub',
    logo: '🐙',
    color: '#24292e',
    scenario: 'Security Agent False Negative',
    problem: 'Agent approved PR with hardcoded secrets',
    business_context: {
      scale: '100M+ repositories',
      criticality: 'Security gatekeeper'
    },
    impact: {
      secrets_exposed: 3,
      repositories_affected: 12,
      security_incident: true
    },
    agent_flow: [
      {
        step: 1,
        title: 'Pattern Detection',
        description: 'Agent scans for secret patterns.',
        tool: 'secret_scanner',
        input: '14 files, API_KEY patterns',
        decision_logic: 'IF pattern_found THEN flag',
        output: '✅ Found 3 potential secrets',
        status: 'success',
        duration: 180,
        confidence: 97
      },
      {
        step: 2,
        title: 'Context Validation',
        description: 'CRITICAL FAILURE: Should validate real vs test secrets.',
        tool: 'context_validator',
        input: '["sk_live_...", "pk_test_...", "api_key_example"]',
        decision_logic: 'BROKEN: assumed all patterns are violations',
        correct_logic: 'SHOULD BE: validate secret authenticity',
        output: '⚠️ Context validation BYPASSED',
        status: 'failure',
        duration: 0,
        confidence: 0,
        reasoning: 'Missing logic to distinguish real vs dummy secrets',
        what_should_have_happened: 'sk_live_* = BLOCK, pk_test_* = ALLOW'
      }
    ],
    fix_recommendation: 'Add context-aware secret validation',
    prevention_confidence: 94
  },
  airbnb: {
    company: 'Airbnb',
    logo: '🏠',
    color: '#FF5A5F',
    scenario: 'VIP Guest Escalation Miss',
    problem: 'Support agent missed VIP guest protocol',
    business_context: {
      scale: '4M+ annual bookings',
      vip_ltv: '$47,000 average'
    },
    impact: {
      guest_lifetime_value_lost: 47000,
      booking_value: 8500,
      negative_review: true
    },
    agent_flow: [
      {
        step: 1,
        title: 'Cancellation Processing',
        description: 'Agent processes cancellation request.',
        tool: 'booking_manager',
        input: 'booking: $8,500, guest: premium_001',
        decision_logic: 'IF valid_request THEN process',
        output: '✅ Request validated',
        status: 'success',
        duration: 340,
        confidence: 99
      },
      {
        step: 2,
        title: 'VIP Status Check',
        description: 'CRITICAL FAILURE: VIP evaluation bypassed.',
        tool: 'guest_tier_analyzer',
        input: 'lifetime: $340K, tier: VIP_PLUS',
        decision_logic: 'MISSING: No VIP integration',
        correct_logic: 'SHOULD BE: IF VIP THEN escalate',
        output: '⚠️ VIP check BYPASSED',
        status: 'failure',
        duration: 0,
        confidence: 0,
        reasoning: 'VIP tier missing from cancellation workflow',
        what_should_have_happened: 'Escalate to specialist + retention'
      }
    ],
    fix_recommendation: 'Integrate VIP status into cancellation workflow',
    prevention_confidence: 88
  }
};

// UI Components
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
    justifyContent: 'center'
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
      border: '1px solid #d1d5db'
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
    onClick: onClick
  }, children);
};

const ProfessionalCard = ({ children, style = {}, hover = false, onClick }) => {
  const cardStyle = {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    cursor: onClick ? 'pointer' : 'default',
    ...style
  };

  return React.createElement('div', {
    style: cardStyle,
    onClick: onClick
  }, children);
};

const StatusBadge = ({ status, confidence }) => {
  const styles = {
    success: { backgroundColor: '#dcfce7', color: '#166534' },
    failure: { backgroundColor: '#fee2e2', color: '#dc2626' },
    warning: { backgroundColor: '#fef3c7', color: '#d97706' }
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
    status.toUpperCase(),
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

  return `${prefix}${displayValue}${suffix}`;
};

// Landing Page
const LandingPage = ({ onSelectScenario }) => {
  return React.createElement('div', {
    style: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      fontFamily: 'Inter, sans-serif'
    }
  },
    // Navigation
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
              borderRadius: '8px'
            }
          }),
          React.createElement('span', {
            style: { fontSize: '20px', fontWeight: '700', color: '#1f2937' }
          }, 'AgentFlow')
        ),
        React.createElement(ProfessionalButton, {
          variant: 'cta',
          size: 'md'
        }, 'Request Demo')
      )
    ),

    // Hero Section
    React.createElement('section', {
      style: { padding: '80px 24px', textAlign: 'center' }
    },
      React.createElement('div', {
        style: { maxWidth: '1200px', margin: '0 auto' }
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
              borderRadius: '50%'
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
            lineHeight: '1.1'
          }
        },
          'Debug AI Agents ',
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

        // Stats
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
              style: {
                fontSize: '36px',
                fontWeight: '800',
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
              style: { fontSize: '14px', color: '#6b7280' }
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
              style: { fontSize: '14px', color: '#6b7280' }
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
              style: { fontSize: '14px', color: '#6b7280' }
            }, 'per incident')
          )
        )
      )
    ),

    // Company Scenarios
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
              fontSize: 'clamp(32px, 6vw, 44px)',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '24px'
            }
          }, '🏢 Real Enterprise Failures'),
          React.createElement('p', {
            style: {
              fontSize: '20px',
              color: '#6b7280',
              maxWidth: '700px',
              margin: '0 auto'
            }
          }, 'See how our platform debugs AI agent failures at top companies')
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
                }, '🔍 Click to Debug →')
              )
            )
          )
        )
      )
    )
  );
};

// Guided Demo
const GuidedDemo = ({ scenario, onComplete }) => {
  const [currentPhase, setCurrentPhase] = useState('context');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [contextIndex, setContextIndex] = useState(0);

  const contextPhases = [
    {
      title: '🎯 Business Context',
      content: `${scenario.company} operates at ${scenario.business_context.scale}. This is ${scenario.business_context.criticality}.`,
      duration: 4000
    },
    {
      title: '❗ What Went Wrong',
      content: `Problem: ${scenario.problem}. Let's trace the agent's decisions step by step.`,
      duration: 3000
    },
    {
      title: '🚀 Starting Analysis',
      content: 'Now examining each agent decision to find the exact failure point...',
      duration: 2000
    }
  ];

  // Auto-advance logic
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

  useEffect(() => {
    if (currentPhase === 'analysis' && isPlaying && currentStep < scenario.agent_flow.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 5000 / speed);
      return () => clearTimeout(timer);
    } else if (currentPhase === 'analysis' && currentStep >= scenario.agent_flow.length && isPlaying) {
      setTimeout(onComplete, 2000 / speed);
    }
  }, [currentPhase, currentStep, isPlaying, speed]);

  return React.createElement('div', {
    style: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      fontFamily: 'Inter, sans-serif'
    }
  },
    // Header
    React.createElement('div', {
      style: {
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px'
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
          React.createElement('span', { style: { fontSize: '40px' } }, scenario.logo),
          React.createElement('div', null,
            React.createElement('h1', {
              style: {
                fontSize: '22px',
                fontWeight: '700',
                color: '#1f2937',
                margin: 0
              }
            }, `${scenario.company} Analysis`)
          )
        ),
        React.createElement('div', {
          style: { display: 'flex', gap: '12px' }
        },
          React.createElement(ProfessionalButton, {
            variant: isPlaying ? 'secondary' : 'cta',
            size: 'sm',
            onClick: () => setIsPlaying(!isPlaying)
          }, isPlaying ? '⏸️ Pause' : '▶️ Play'),
          React.createElement(ProfessionalButton, {
            variant: 'secondary',
            size: 'sm',
            onClick: () => window.history.back()
          }, '← Back')
        )
      )
    ),

    // Content
    React.createElement('div', {
      style: { maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }
    },
      // Context phase
      currentPhase === 'context' && React.createElement('div', {
        style: { textAlign: 'center' }
      },
        !isPlaying && React.createElement(ProfessionalButton, {
          variant: 'cta',
          size: 'xl',
          onClick: () => setIsPlaying(true),
          style: { marginBottom: '32px' }
        }, '▶️ Start Analysis'),
        
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
              lineHeight: '1.6'
            }
          }, contextPhases[contextIndex].content)
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
        React.createElement(ProfessionalCard, {
          style: { padding: '32px' }
        },
          React.createElement('h2', {
            style: {
              fontSize: '24px',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '32px'
            }
          }, '🔍 Agent Decision Flow'),

          React.createElement('div', {
            style: { display: 'grid', gap: '20px' }
          },
            scenario.agent_flow.map((step, index) =>
              React.createElement('div', {
                key: index,
                style: {
                  border: currentStep > index ? (step.status === 'failure' ? '2px solid #ef4444' : '2px solid #10b981') : '1px solid #e5e7eb',
                  borderRadius: '16px',
                  padding: '24px',
                  backgroundColor: currentStep > index ? (step.status === 'failure' ? '#fef2f2' : '#f0fdf4') : '#f9fafb',
                  opacity: currentStep >= index ? 1 : 0.4,
                  transition: 'all 0.5s ease'
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
                      backgroundColor: currentStep > index ? (step.status === 'failure' ? '#ef4444' : '#10b981') : '#9ca3af',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: '700'
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
                          marginBottom: '12px'
                        }
                      }, '🚨 Root Cause Found'),
                      React.createElement('p', {
                        style: {
                          color: '#b91c1c',
                          fontSize: '14px',
                          marginBottom: '12px'
                        }
                      }, step.reasoning),
                      step.what_should_have_happened && React.createElement('div', {
                        style: {
                          backgroundColor: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          borderRadius: '8px',
                          padding: '12px'
                        }
                      },
                        React.createElement('div', {
                          style: {
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#059669',
                            marginBottom: '4px'
                          }
                        }, '💡 Fix:'),
                        React.createElement('div', {
                          style: {
                            fontSize: '13px',
                            color: '#166534'
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

        // Side panel
        window.innerWidth > 1024 && currentStep >= scenario.agent_flow.length && React.createElement(ProfessionalCard, {
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
              marginBottom: '16px'
            }
          }, '🛠️ Fix Recommendation'),
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
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center'
            }
          },
            React.createElement('div', {
              style: {
                fontSize: '12px',
                color: '#6b7280',
                marginBottom: '4px'
              }
            }, 'Confidence'),
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
    )
  );
};

// Results Page
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
      style: { maxWidth: '900px', margin: '0 auto', textAlign: 'center' }
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
        }, 'Analysis Complete!'),
        React.createElement('p', {
          style: {
            fontSize: '18px',
            color: '#374151',
            lineHeight: '1.6',
            marginBottom: '32px'
          }
        }, `Root cause identified in ${scenario.company}'s agent failure with ${scenario.prevention_confidence}% confidence.`),
        
        React.createElement('div', {
          style: { display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }
        },
          React.createElement(ProfessionalButton, {
            variant: 'secondary',
            size: 'lg',
            onClick: onBackToHome
          }, '← Try Another Company'),
          React.createElement(ProfessionalButton, {
            variant: 'cta',
            size: 'lg'
          }, '🚀 Schedule Demo')
        )
      )
    )
  );
};

// Main App
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

// Render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
