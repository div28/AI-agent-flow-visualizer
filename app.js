const { useState, useEffect } = React;

// Enterprise-grade sample data with realistic scenarios
const enterpriseScenarios = {
  atlassian: {
    company: 'Atlassian',
    logo: '🔷',
    scenario: 'DevOps Deployment Pipeline Failure',
    description: 'Production deployment agent bypassed critical integration tests',
    impact: {
      revenue_loss: 127000,
      downtime_minutes: 360,
      customers_affected: 15000,
      sla_violations: 3
    },
    agent_flow: [
      {
        step: 1,
        action: 'Code Analysis',
        tool: 'code_analyzer_v2',
        input: 'database_migration.sql (47 lines)',
        output: '✅ Syntax validation passed',
        status: 'success',
        duration: '245ms',
        confidence: '99%'
      },
      {
        step: 2,
        action: 'Security Scan',
        tool: 'security_scanner',
        input: 'full_codebase (12,847 files)',
        output: '✅ No vulnerabilities detected',
        status: 'success',
        duration: '1.2s',
        confidence: '95%'
      },
      {
        step: 3,
        action: 'Integration Tests',
        tool: 'test_runner',
        input: 'database_integration_suite',
        output: '⚠️ SKIPPED - Agent decision: "Low risk change"',
        status: 'skipped',
        duration: '0ms',
        confidence: '0%',
        error_reason: 'Agent failed to detect database schema changes require integration testing',
        should_have_run: true
      },
      {
        step: 4,
        action: 'Production Deploy',
        tool: 'deployment_manager',
        input: 'production_environment',
        output: '❌ Database connection pool exhausted',
        status: 'failure',
        duration: '30s',
        confidence: '0%'
      }
    ],
    root_cause: 'Agent\'s decision tree missing conditional logic: IF database_changes THEN require_integration_tests',
    fix_recommendation: 'Add mandatory integration test checkpoint for database migrations',
    prevention_confidence: '96%'
  },
  stripe: {
    company: 'Stripe',
    logo: '💳',
    scenario: 'Multi-Agent Fraud Detection Conflict',
    description: 'Payment processing agents returned conflicting fraud scores',
    impact: {
      revenue_loss: 50000,
      downtime_minutes: 0,
      customers_affected: 1,
      false_positive_rate: '12%'
    },
    agent_flow: [
      {
        step: 1,
        action: 'Velocity Check',
        tool: 'velocity_analyzer',
        input: 'transaction_$50k, user_history',
        output: '✅ Within normal velocity patterns',
        status: 'success',
        duration: '120ms',
        confidence: '89%'
      },
      {
        step: 2,
        action: 'Device Fingerprint',
        tool: 'device_analyzer',
        input: 'browser_fingerprint, location_data',
        output: '✅ Known device from San Francisco',
        status: 'success',
        duration: '80ms',
        confidence: '94%'
      },
      {
        step: 3,
        action: 'Agent Coordination',
        tool: 'multi_agent_orchestrator',
        input: 'agent_1_score: 0.15, agent_2_score: 0.85',
        output: '❌ Conflicting risk scores - no consensus mechanism',
        status: 'failure',
        duration: '5s',
        confidence: '0%',
        error_reason: 'No coordination protocol for conflicting agent decisions',
        should_have_run: true
      }
    ],
    root_cause: 'Missing orchestration layer for multi-agent decision reconciliation',
    fix_recommendation: 'Implement weighted consensus algorithm with confidence thresholds',
    prevention_confidence: '91%'
  }
};

// Professional UI Components
const StatusBadge = ({ status, confidence }) => {
  const badgeStyles = {
    success: { bg: '#10b981', color: 'white', icon: '✅' },
    failure: { bg: '#ef4444', color: 'white', icon: '❌' },
    skipped: { bg: '#f59e0b', color: 'white', icon: '⚠️' },
    warning: { bg: '#f59e0b', color: 'white', icon: '⚠️' }
  };

  const style = badgeStyles[status] || badgeStyles.warning;

  return React.createElement('div', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '6px 12px',
      borderRadius: '20px',
      backgroundColor: style.bg,
      color: style.color,
      fontSize: '12px',
      fontWeight: '600',
      gap: '4px'
    }
  },
    React.createElement('span', null, style.icon),
    React.createElement('span', null, status.toUpperCase()),
    confidence && React.createElement('span', { style: { opacity: 0.8 } }, `${confidence}`)
  );
};

const MetricCard = ({ label, value, subtitle, trend, color = '#3b82f6' }) => {
  return React.createElement('div', {
    style: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '24px',
      textAlign: 'center'
    }
  },
    React.createElement('div', {
      style: {
        fontSize: '32px',
        fontWeight: '800',
        color: color,
        marginBottom: '8px'
      }
    }, value),
    React.createElement('div', {
      style: {
        fontSize: '14px',
        fontWeight: '600',
        color: 'white',
        marginBottom: '4px'
      }
    }, label),
    subtitle && React.createElement('div', {
      style: {
        fontSize: '12px',
        color: '#94a3b8',
        fontWeight: '500'
      }
    }, subtitle)
  );
};

const FlowStep = ({ step, isActive, isCompleted }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const stepStyle = {
    background: isActive ? 'rgba(59, 130, 246, 0.15)' : 
                isCompleted ? 'rgba(16, 185, 129, 0.15)' :
                step.status === 'failure' ? 'rgba(239, 68, 68, 0.15)' :
                step.status === 'skipped' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.05)',
    border: isActive ? '2px solid #3b82f6' :
            isCompleted ? '2px solid #10b981' :
            step.status === 'failure' ? '2px solid #ef4444' :
            step.status === 'skipped' ? '2px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '20px',
    margin: '12px 0',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)'
  };

  const stepNumberStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: isCompleted ? '#10b981' : isActive ? '#3b82f6' : '#64748b',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '16px',
    marginRight: '16px',
    flexShrink: 0
  };

  return React.createElement('div', {
    style: stepStyle,
    onClick: () => setIsExpanded(!isExpanded)
  },
    React.createElement('div', {
      style: { display: 'flex', alignItems: 'flex-start', gap: '16px' }
    },
      React.createElement('div', { style: stepNumberStyle }, step.step),
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
              fontSize: '18px',
              fontWeight: '600',
              margin: 0
            }
          }, step.action),
          React.createElement('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
            React.createElement(StatusBadge, { 
              status: step.status, 
              confidence: step.confidence 
            }),
            React.createElement('span', {
              style: { color: '#94a3b8', fontSize: '12px', fontWeight: '500' }
            }, step.duration)
          )
        ),
        React.createElement('div', {
          style: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '12px'
          }
        },
          React.createElement('div', null,
            React.createElement('div', {
              style: { color: '#94a3b8', fontSize: '12px', fontWeight: '500', marginBottom: '4px' }
            }, 'INPUT'),
            React.createElement('div', {
              style: { 
                color: '#e2e8f0', 
                fontSize: '14px', 
                fontFamily: 'Monaco, monospace',
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '8px',
                borderRadius: '6px'
              }
            }, step.input)
          ),
          React.createElement('div', null,
            React.createElement('div', {
              style: { color: '#94a3b8', fontSize: '12px', fontWeight: '500', marginBottom: '4px' }
            }, 'OUTPUT'),
            React.createElement('div', {
              style: { 
                color: step.status === 'failure' ? '#fca5a5' : step.status === 'skipped' ? '#fde68a' : '#86efac',
                fontSize: '14px',
                fontFamily: 'Monaco, monospace',
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '8px',
                borderRadius: '6px'
              }
            }, step.output)
          )
        ),
        isExpanded && step.error_reason && React.createElement('div', {
          style: {
            marginTop: '16px',
            padding: '16px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px'
          }
        },
          React.createElement('div', {
            style: { color: '#fca5a5', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }
          }, '🚨 Root Cause Analysis'),
          React.createElement('div', {
            style: { color: '#fecaca', fontSize: '13px', lineHeight: '1.5' }
          }, step.error_reason)
        ),
        React.createElement('div', {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '8px'
          }
        },
          React.createElement('span', {
            style: { color: '#64748b', fontSize: '12px' }
          }, `Tool: ${step.tool}`),
          React.createElement('button', {
            style: {
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: '500'
            },
            onClick: (e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }
          }, isExpanded ? '▲ Less' : '▼ More')
        )
      )
    )
  );
};

const GuidedDemo = ({ scenario, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    if (isPlaying && currentStep < scenario.agent_flow.length) {
      const timer = setTimeout(() => {
        setCompletedSteps(prev => [...prev, currentStep]);
        setCurrentStep(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (currentStep >= scenario.agent_flow.length && isPlaying) {
      setIsPlaying(false);
      setTimeout(onComplete, 1000);
    }
  }, [currentStep, isPlaying, scenario.agent_flow.length, onComplete]);

  const startDemo = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setIsPlaying(true);
  };

  return React.createElement('div', {
    style: {
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      minHeight: '100vh',
      padding: '40px 20px'
    }
  },
    React.createElement('div', {
      style: { maxWidth: '1200px', margin: '0 auto' }
    },
      React.createElement('div', {
        style: { textAlign: 'center', marginBottom: '40px' }
      },
        React.createElement('div', {
          style: { fontSize: '48px', marginBottom: '16px' }
        }, scenario.logo),
        React.createElement('h1', {
          style: {
            color: 'white',
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '12px'
          }
        }, `${scenario.company} AI Agent Failure Analysis`),
        React.createElement('p', {
          style: {
            color: '#94a3b8',
            fontSize: '18px',
            maxWidth: '600px',
            margin: '0 auto 32px auto',
            lineHeight: '1.6'
          }
        }, scenario.description),
        !isPlaying && currentStep === 0 && React.createElement('button', {
          style: {
            background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
            transition: 'transform 0.2s ease'
          },
          onMouseEnter: (e) => e.target.style.transform = 'scale(1.05)',
          onMouseLeave: (e) => e.target.style.transform = 'scale(1)',
          onClick: startDemo
        }, '▶️ Start Guided Analysis')
      ),

      React.createElement('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '40px',
          alignItems: 'start'
        }
      },
        React.createElement('div', {
          style: {
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '32px'
          }
        },
          React.createElement('h2', {
            style: {
              color: 'white',
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }
          },
            '🔍 Agent Decision Flow',
            isPlaying && React.createElement('div', {
              style: {
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                animation: 'pulse 1s infinite'
              }
            })
          ),
          ...scenario.agent_flow.map((step, index) =>
            React.createElement(FlowStep, {
              key: index,
              step: step,
              isActive: currentStep === index && isPlaying,
              isCompleted: completedSteps.includes(index)
            })
          )
        ),

        React.createElement('div', null,
          React.createElement('div', {
            style: {
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px'
            }
          },
            React.createElement('h3', {
              style: {
                color: '#fca5a5',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px'
              }
            }, '💸 Business Impact'),
            React.createElement('div', {
              style: { display: 'grid', gap: '12px' }
            },
              React.createElement(MetricCard, {
                label: 'Revenue Loss',
                value: `$${scenario.impact.revenue_loss.toLocaleString()}`,
                color: '#ef4444'
              }),
              React.createElement(MetricCard, {
                label: 'Downtime',
                value: `${Math.floor(scenario.impact.downtime_minutes / 60)}h ${scenario.impact.downtime_minutes % 60}m`,
                color: '#f59e0b'
              }),
              React.createElement(MetricCard, {
                label: 'Customers Affected',
                value: scenario.impact.customers_affected.toLocaleString(),
                color: '#ef4444'
              })
            )
          ),

          React.createElement('div', {
            style: {
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '16px',
              padding: '24px'
            }
          },
            React.createElement('h3', {
              style: {
                color: '#6ee7b7',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '12px'
              }
            }, '🛠️ Fix Recommendation'),
            React.createElement('p', {
              style: {
                color: '#a7f3d0',
                fontSize: '14px',
                lineHeight: '1.5',
                marginBottom: '12px'
              }
            }, scenario.fix_recommendation),
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }
            },
              React.createElement('span', {
                style: { color: '#6ee7b7', fontSize: '12px', fontWeight: '500' }
              }, 'Prevention Confidence'),
              React.createElement('span', {
                style: { color: '#10b981', fontSize: '16px', fontWeight: '700' }
              }, scenario.prevention_confidence)
            )
          )
        )
      )
    ),

    React.createElement('style', null, `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `)
  );
};

const LandingPage = ({ onStartDemo }) => {
  return React.createElement('div', {
    style: {
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      minHeight: '100vh',
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
          radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)
        `
      }
    }),

    React.createElement('div', {
      style: {
        position: 'relative',
        zIndex: 10,
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 20px',
        textAlign: 'center'
      }
    },
      React.createElement('div', {
        style: { marginBottom: '60px' }
      },
        React.createElement('h1', {
          style: {
            fontSize: 'clamp(40px, 8vw, 72px)',
            fontWeight: '800',
            color: 'white',
            marginBottom: '24px',
            lineHeight: '1.1'
          }
        },
          'Debug AI Agents',
          React.createElement('br'),
          React.createElement('span', {
            style: {
              background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }
          }, 'Like Never Before')
        ),
        React.createElement('p', {
          style: {
            fontSize: 'clamp(18px, 3vw, 24px)',
            color: '#94a3b8',
            maxWidth: '800px',
            margin: '0 auto 48px auto',
            lineHeight: '1.6',
            fontWeight: '400'
          }
        }, 'Enterprise-grade platform for visualizing multi-step AI agent decision flows. Understand exactly where agents fail, why they make wrong choices, and the real business impact.')
      ),

      React.createElement('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px',
          marginBottom: '60px'
        }
      },
        React.createElement('div', {
          style: {
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '32px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          },
          onMouseEnter: (e) => e.target.style.transform = 'translateY(-8px)',
          onMouseLeave: (e) => e.target.style.transform = 'translateY(0)',
          onClick: () => onStartDemo('atlassian')
        },
          React.createElement('div', {
            style: { fontSize: '48px', marginBottom: '16px' }
          }, '🔷'),
          React.createElement('h3', {
            style: {
              color: 'white',
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '12px'
            }
          }, 'Atlassian DevOps Failure'),
          React.createElement('p', {
            style: {
              color: '#94a3b8',
              fontSize: '16px',
              lineHeight: '1.5',
              marginBottom: '16px'
            }
          }, 'Deployment agent bypassed integration tests causing $127K production outage'),
          React.createElement('div', {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '14px',
              fontWeight: '600'
            }
          },
            React.createElement('span', { style: { color: '#ef4444' } }, '$127K Loss'),
            React.createElement('span', { style: { color: '#f59e0b' } }, '6h Downtime')
          ),
          React.createElement('div', {
            style: {
              marginTop: '16px',
              padding: '8px 16px',
              background: 'rgba(59, 130, 246, 0.2)',
              borderRadius: '20px',
              color: '#93c5fd',
              fontSize: '14px',
              fontWeight: '600'
            }
          }, 'Click to analyze →')
        ),

        React.createElement('div', {
          style: {
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '32px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          },
          onMouseEnter: (e) => e.target.style.transform = 'translateY(-8px)',
          onMouseLeave: (e) => e.target.style.transform = 'translateY(0)',
          onClick: () => onStartDemo('stripe')
        },
          React.createElement('div', {
            style: { fontSize: '48px', marginBottom: '16px' }
          }, '💳'),
          React.createElement('h3', {
            style: {
              color: 'white',
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '12px'
            }
          }, 'Stripe Fraud Detection'),
          React.createElement('p', {
            style: {
              color: '#94a3b8',
              fontSize: '16px',
              lineHeight: '1.5',
              marginBottom: '16px'
            }
          }, 'Multi-agent system conflict blocked legitimate $50K transaction'),
          React.createElement('div', {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '14px',
              fontWeight: '600'
            }
          },
            React.createElement('span', { style: { color: '#ef4444' } }, '$50K Blocked'),
            React.createElement('span', { style: { color: '#f59e0b' } }, '12% False Positive')
          ),
          React.createElement('div', {
            style: {
              marginTop: '16px',
              padding: '8px 16px',
              background: 'rgba(59, 130, 246, 0.2)',
              borderRadius: '20px',
              color: '#93c5fd',
              fontSize: '14px',
              fontWeight: '600'
            }
          }, 'Click to analyze →')
        )
      ),

      React.createElement('div', {
        style: {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '48px',
          maxWidth: '800px',
          margin: '0 auto'
        }
      },
        React.createElement('h2', {
          style: {
            color: 'white',
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '24px'
          }
        }, 'Why Enterprise AI Teams Choose Our Platform'),
        React.createElement('div', {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px',
            textAlign: 'left'
          }
        },
          React.createElement('div', null,
            React.createElement('div', {
              style: { fontSize: '32px', marginBottom: '12px' }
            }, '🎯'),
            React.createElement('h3', {
              style: { color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }
            }, 'Decision Flow Visibility'),
            React.createElement('p', {
              style: { color: '#94a3b8', fontSize: '14px', lineHeight: '1.5' }
            }, 'See exactly which tool agents called and why')
          ),
          React.createElement('div', null,
            React.createElement('div', {
              style: { fontSize: '32px', marginBottom: '12px' }
            }, '💰'),
            React.createElement('h3', {
              style: { color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }
            }, 'Business Impact Tracking'),
            React.createElement('p', {
              style: { color: '#94a3b8', fontSize: '14px', lineHeight: '1.5' }
            }, 'Calculate real revenue loss and downtime costs')
          ),
          React.createElement('div', null,
            React.createElement('div', {
              style: { fontSize: '32px', marginBottom: '12px' }
            }, '🔧'),
            React.createElement('h3', {
              style: { color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }
            }, 'AI-Powered Fixes'),
            React.createElement('p', {
              style: { color: '#94a3b8', fontSize: '14px', lineHeight: '1.5' }
            }, 'Get specific recommendations with 90%+ confidence')
          )
        )
      )
    )
  );
};

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
      }
      
      * {
        box-sizing: border-box;
      }
      
      @media (max-width: 768px) {
        .demo-grid {
          grid-template-columns: 1fr !important;
          gap: 20px !important;
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

  const handleStartDemo = (scenarioKey) => {
    setSelectedScenario(enterpriseScenarios[scenarioKey]);
    setCurrentView('demo');
  };

  const handleDemoComplete = () => {
    setTimeout(() => {
      setCurrentView('results');
    }, 1000);
  };

  const handleBackToLanding = () => {
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
    return React.createElement('div', {
      style: {
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        minHeight: '100vh',
        padding: '40px 20px',
        textAlign: 'center'
      }
    },
      React.createElement('div', {
        style: { maxWidth: '800px', margin: '0 auto' }
      },
        React.createElement('div', {
          style: { fontSize: '64px', marginBottom: '24px' }
        }, '🎉'),
        React.createElement('h1', {
          style: {
            color: 'white',
            fontSize: '36px',
            fontWeight: '700',
            marginBottom: '16px'
          }
        }, 'Analysis Complete!'),
        React.createElement('p', {
          style: {
            color: '#94a3b8',
            fontSize: '18px',
            marginBottom: '32px',
            lineHeight: '1.6'
          }
        }, `You've seen how our AI Agent Flow Visualizer identifies the exact failure point in ${selectedScenario.company}'s system and provides actionable fixes with ${selectedScenario.prevention_confidence} confidence.`),
        React.createElement('div', {
          style: {
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px'
          }
        },
          React.createElement('h2', {
            style: { color: '#6ee7b7', fontSize: '24px', fontWeight: '600', marginBottom: '16px' }
          }, 'Key Benefits Demonstrated'),
          React.createElement('div', {
            style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', textAlign: 'left' }
          },
            React.createElement('div', null,
              React.createElement('div', { style: { color: '#10b981', fontSize: '20px', fontWeight: '700', marginBottom: '4px' } }, '✓ Root Cause Found'),
              React.createElement('div', { style: { color: '#a7f3d0', fontSize: '14px' } }, 'Exact decision logic failure identified')
            ),
            React.createElement('div', null,
              React.createElement('div', { style: { color: '#10b981', fontSize: '20px', fontWeight: '700', marginBottom: '4px' } }, `✓ $${selectedScenario.impact.revenue_loss.toLocaleString()} Prevented`),
              React.createElement('div', { style: { color: '#a7f3d0', fontSize: '14px' } }, 'Future losses avoided with fix')
            ),
            React.createElement('div', null,
              React.createElement('div', { style: { color: '#10b981', fontSize: '20px', fontWeight: '700', marginBottom: '4px' } }, `✓ ${selectedScenario.prevention_confidence} Fix Confidence`),
              React.createElement('div', { style: { color: '#a7f3d0', fontSize: '14px' } }, 'AI-validated solution reliability')
            )
          )
        ),
        React.createElement('div', {
          style: { display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }
        },
          React.createElement('button', {
            style: {
              padding: '16px 32px',
              background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            },
            onMouseEnter: (e) => e.target.style.transform = 'scale(1.05)',
            onMouseLeave: (e) => e.target.style.transform = 'scale(1)',
            onClick: handleBackToLanding
          }, '← Try Another Scenario'),
          React.createElement('button', {
            style: {
              padding: '16px 32px',
              background: 'linear-gradient(45deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            },
            onMouseEnter: (e) => e.target.style.transform = 'scale(1.05)',
            onMouseLeave: (e) => e.target.style.transform = 'scale(1)',
            onClick: () => window.open('https://linkedin.com/in/yourname', '_blank')
          }, '🚀 Contact for Demo')
        )
      )
    );
  }

  return React.createElement(LandingPage, { onStartDemo: handleStartDemo });
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
