const { useState, useEffect } = React;

// Sample data
const sampleFlows = [
  {
    id: 'atlassian-001',
    company: 'Atlassian',
    agent_type: 'DevOps Deployment',
    scenario: 'Database Migration Deployment',
    status: 'failure',
    business_impact: {
      financial_loss: 127000,
      downtime_hours: 6,
      customers_affected: 15000
    },
    steps: [
      {
        id: 'step-1',
        step_order: 1,
        tool_name: 'code_analysis',
        input_data: 'src/migration/schema.sql',
        output_data: '✅ Schema changes validated',
        status: 'success',
        execution_time: '245ms'
      },
      {
        id: 'step-2',
        step_order: 2,
        tool_name: 'security_scan',
        input_data: 'full_codebase',
        output_data: '✅ No vulnerabilities detected',
        status: 'success',
        execution_time: '1.2s'
      },
      {
        id: 'step-3',
        step_order: 3,
        tool_name: 'integration_tests',
        status: 'skipped',
        execution_time: '0ms',
        should_have_called: true,
        reasoning: 'Agent bypassed integration tests for database changes'
      },
      {
        id: 'step-4',
        step_order: 4,
        tool_name: 'deployment',
        input_data: 'production_deploy',
        output_data: '❌ Database connection timeout',
        status: 'failure',
        execution_time: '30s'
      }
    ]
  },
  {
    id: 'stripe-001',
    company: 'Stripe',
    agent_type: 'Fraud Detection',
    scenario: 'Multi-Agent Payment Processing',
    status: 'failure',
    business_impact: {
      financial_loss: 50000,
      downtime_hours: 0,
      customers_affected: 1
    },
    steps: [
      {
        id: 'step-1',
        step_order: 1,
        tool_name: 'velocity_check',
        input_data: 'transaction_$50k',
        output_data: '✅ Velocity within limits',
        status: 'success',
        execution_time: '120ms'
      },
      {
        id: 'step-2',
        step_order: 2,
        tool_name: 'device_analysis',
        input_data: 'device_fingerprint',
        output_data: '✅ Known device',
        status: 'success',
        execution_time: '80ms'
      },
      {
        id: 'step-3',
        step_order: 3,
        tool_name: 'agent_coordination',
        status: 'failure',
        execution_time: '5s',
        reasoning: 'Multiple agents returned conflicting risk scores'
      }
    ]
  },
  {
    id: 'github-001',
    company: 'GitHub',
    agent_type: 'Security Review',
    scenario: 'PR Security Validation',
    status: 'failure',
    business_impact: {
      financial_loss: 34000,
      downtime_hours: 2,
      customers_affected: 500
    },
    steps: [
      {
        id: 'step-1',
        step_order: 1,
        tool_name: 'pattern_detection',
        input_data: 'pull_request_files',
        output_data: '✅ API key pattern found',
        status: 'success',
        execution_time: '180ms'
      },
      {
        id: 'step-2',
        step_order: 2,
        tool_name: 'context_analysis',
        status: 'skipped',
        execution_time: '0ms',
        reasoning: 'Agent skipped validation if key is real vs test dummy'
      },
      {
        id: 'step-3',
        step_order: 3,
        tool_name: 'auto_approve',
        output_data: '❌ PR approved with hardcoded secrets',
        status: 'failure',
        execution_time: '50ms'
      }
    ]
  }
];

const companies = [
  { id: 'atlassian', name: 'Atlassian', logo: '🔷', activeIssues: 12 },
  { id: 'stripe', name: 'Stripe', logo: '💳', activeIssues: 8 },
  { id: 'github', name: 'GitHub', logo: '🐙', activeIssues: 15 },
  { id: 'grafana', name: 'Grafana', logo: '📊', activeIssues: 6 },
  { id: 'airbnb', name: 'Airbnb', logo: '🏠', activeIssues: 9 }
];

// Navigation function
function scrollToSection(targetId) {
  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

// Components
const StatusIcon = ({ status }) => {
  const iconMap = {
    success: '✅',
    failure: '❌',
    warning: '⚠️',
    skipped: '⏸️'
  };
  return React.createElement('span', { 
    style: { fontSize: '20px', marginRight: '8px' } 
  }, iconMap[status] || '🔄');
};

const FlowStep = ({ step, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 200);
    return () => clearTimeout(timer);
  }, [index]);

  const stepStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    margin: '8px 0',
    borderRadius: '12px',
    border: step.status === 'failure' ? '2px solid #ef4444' : 
           step.status === 'skipped' ? '2px solid #f59e0b' : '2px solid #10b981',
    backgroundColor: step.status === 'failure' ? 'rgba(239, 68, 68, 0.1)' :
                    step.status === 'skipped' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
    color: 'white',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
    transition: 'all 0.5s ease-out'
  };

  const stepNumberStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#4f46e5',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    marginRight: '16px',
    fontSize: '14px'
  };

  return React.createElement('div', { style: stepStyle },
    React.createElement('div', { style: stepNumberStyle }, step.step_order),
    React.createElement(StatusIcon, { status: step.status }),
    React.createElement('div', { style: { flex: 1 } },
      React.createElement('h4', { style: { margin: '0 0 4px 0', color: 'white', fontSize: '16px' } }, step.tool_name),
      step.input_data && React.createElement('p', { style: { margin: '2px 0', fontSize: '14px', color: '#d1d5db' } }, 
        `Input: ${step.input_data}`),
      step.output_data && React.createElement('p', { style: { margin: '2px 0', fontSize: '14px', color: '#d1d5db' } }, 
        `Output: ${step.output_data}`),
      step.reasoning && React.createElement('p', { style: { margin: '8px 0 0 0', fontSize: '14px', color: '#fbbf24', fontWeight: 'bold' } }, 
        `⚠️ ${step.reasoning}`)
    ),
    React.createElement('span', { style: { color: '#9ca3af', fontSize: '12px', fontWeight: 'bold' } }, step.execution_time)
  );
};

const BusinessImpactCard = ({ impact }) => {
  const cardStyle = {
    padding: '20px',
    marginTop: '20px',
    borderRadius: '12px',
    border: '2px solid rgba(239, 68, 68, 0.3)',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: 'white'
  };

  const metricsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    marginTop: '16px'
  };

  const metricStyle = {
    textAlign: 'center',
    padding: '12px'
  };

  return React.createElement('div', { style: cardStyle },
    React.createElement('h4', { style: { margin: '0 0 16px 0', color: 'white', fontSize: '18px' } }, '💸 Business Impact'),
    React.createElement('div', { style: metricsStyle },
      React.createElement('div', { style: metricStyle },
        React.createElement('div', { style: { fontSize: '24px', fontWeight: 'bold', color: '#ef4444' } }, 
          `$${impact.financial_loss.toLocaleString()}`),
        React.createElement('div', { style: { fontSize: '12px', color: '#9ca3af' } }, 'Financial Loss')
      ),
      React.createElement('div', { style: metricStyle },
        React.createElement('div', { style: { fontSize: '24px', fontWeight: 'bold', color: '#ef4444' } }, 
          `${impact.downtime_hours}h`),
        React.createElement('div', { style: { fontSize: '12px', color: '#9ca3af' } }, 'Downtime')
      ),
      React.createElement('div', { style: metricStyle },
        React.createElement('div', { style: { fontSize: '24px', fontWeight: 'bold', color: '#ef4444' } }, 
          impact.customers_affected.toLocaleString()),
        React.createElement('div', { style: { fontSize: '12px', color: '#9ca3af' } }, 'Customers Affected')
      )
    )
  );
};

const FlowVisualization = ({ flow }) => {
  const containerStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '24px',
    margin: '20px 0'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '12px'
  };

  const titleStyle = {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 4px 0'
  };

  const subtitleStyle = {
    color: '#9ca3af',
    margin: 0,
    fontSize: '16px'
  };

  const statusStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    borderRadius: '20px',
    backgroundColor: flow.status === 'failure' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
    color: 'white',
    fontWeight: 'bold'
  };

  return React.createElement('div', { style: containerStyle },
    React.createElement('div', { style: headerStyle },
      React.createElement('div', null,
        React.createElement('h3', { style: titleStyle }, flow.scenario),
        React.createElement('p', { style: subtitleStyle }, `${flow.company} • ${flow.agent_type}`)
      ),
      React.createElement('div', { style: statusStyle },
        React.createElement(StatusIcon, { status: flow.status }),
        flow.status.charAt(0).toUpperCase() + flow.status.slice(1)
      )
    ),
    React.createElement('div', null,
      ...flow.steps.map((step, index) => 
        React.createElement(FlowStep, { key: step.id, step, index })
      )
    ),
    React.createElement(BusinessImpactCard, { impact: flow.business_impact })
  );
};

const CompanyCard = ({ company, onClick, isSelected }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const cardStyle = {
    backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    border: isSelected ? '2px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.1)',
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    margin: '8px 0',
    transform: isHovered && !isSelected ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)'
  };

  return React.createElement('div', { 
    style: cardStyle,
    onClick: () => onClick(company),
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false)
  },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', marginBottom: '8px' } },
      React.createElement('span', { style: { fontSize: '24px', marginRight: '12px' } }, company.logo),
      React.createElement('span', { style: { color: 'white', fontWeight: 'bold', fontSize: '16px' } }, company.name)
    ),
    React.createElement('p', { style: { 
      color: '#ef4444', 
      fontSize: '14px', 
      margin: 0,
      fontWeight: '500' 
    } }, `${company.activeIssues} active issues`)
  );
};

const InteractiveCompanyGrid = ({ onCompanySelect }) => {
  const [hoveredCompany, setHoveredCompany] = useState(null);
  
  const companiesGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  };

  const companyCardStyle = (company) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '24px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    transform: hoveredCompany === company.id ? 'scale(1.05) translateY(-5px)' : 'scale(1) translateY(0)',
    boxShadow: hoveredCompany === company.id ? '0 10px 25px rgba(0,0,0,0.2)' : '0 4px 6px rgba(0,0,0,0.1)'
  });

  return React.createElement('div', { style: companiesGridStyle },
    ...companies.map(company =>
      React.createElement('div', {
        key: company.id,
        style: companyCardStyle(company),
        onMouseEnter: () => setHoveredCompany(company.id),
        onMouseLeave: () => setHoveredCompany(null),
        onClick: () => onCompanySelect(company)
      },
        React.createElement('div', { style: { fontSize: '48px', marginBottom: '12px' } }, company.logo),
        React.createElement('h3', { style: { color: 'white', fontWeight: 'bold', margin: '0 0 8px 0', fontSize: '20px' } }, company.name),
        React.createElement('p', { style: { color: '#ef4444', fontSize: '14px', margin: 0, fontWeight: 'bold' } }, 
          `${company.activeIssues} active issues`),
        React.createElement('div', { 
          style: { 
            marginTop: '12px', 
            padding: '8px 16px', 
            backgroundColor: 'rgba(99, 102, 241, 0.2)', 
            borderRadius: '20px',
            color: '#a5b4fc',
            fontSize: '12px',
            fontWeight: 'bold'
          } 
        }, 'Click to explore →')
      )
    )
  );
};

const LandingPage = ({ onNavigateToWorkspace }) => {
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
  };

  const heroStyle = {
    textAlign: 'center',
    padding: '80px 20px 60px 20px',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const titleStyle = {
    fontSize: 'clamp(32px, 8vw, 64px)',
    fontWeight: '900',
    color: 'white',
    margin: '0 0 24px 0',
    lineHeight: '1.1'
  };

  const gradientTextStyle = {
    background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent'
  };

  const subtitleStyle = {
    fontSize: 'clamp(16px, 3vw, 20px)',
    color: '#d1d5db',
    margin: '0 0 40px 0',
    maxWidth: '800px',
    marginLeft: 'auto',
    marginRight: 'auto',
    lineHeight: '1.6'
  };

  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '16px 32px',
    background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '18px',
    transition: 'all 0.3s ease',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
  };

  const sectionStyle = {
    padding: '60px 20px',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  return React.createElement('div', { style: containerStyle },
    React.createElement('div', { style: heroStyle },
      React.createElement('h1', { style: titleStyle },
        'Debug AI Agents',
        React.createElement('br'),
        React.createElement('span', { style: gradientTextStyle }, 'Like Never Before')
      ),
      React.createElement('p', { style: subtitleStyle },
        'Visualize multi-step AI agent decision flows. Understand exactly where agents fail, why they make wrong choices, and the real business impact across enterprise companies.'
      ),
      React.createElement('button', { 
        style: buttonStyle,
        onMouseEnter: (e) => {
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
        },
        onMouseLeave: (e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.3)';
        },
        onClick: onNavigateToWorkspace
      }, 
        '🚀 Explore Live Demo',
        React.createElement('span', { style: { marginLeft: '8px' } }, '→')
      )
    ),
    React.createElement('div', { id: 'companies', style: sectionStyle },
      React.createElement('h2', { 
        style: { 
          textAlign: 'center', 
          color: 'white', 
          fontSize: 'clamp(24px, 5vw, 36px)', 
          fontWeight: 'bold',
          margin: '0 0 40px 0'
        } 
      }, 'Real Failures from Top Companies'),
      React.createElement(InteractiveCompanyGrid, { 
        onCompanySelect: (company) => {
          onNavigateToWorkspace(company);
        }
      })
    )
  );
};

const WorkspacePage = ({ initialCompany }) => {
  const [selectedFlow, setSelectedFlow] = useState(sampleFlows[0]);
  const [selectedCompany, setSelectedCompany] = useState(initialCompany || companies[0]);

  useEffect(() => {
    if (initialCompany) {
      setSelectedCompany(initialCompany);
      const companyFlows = sampleFlows.filter(flow => flow.company === initialCompany.name);
      if (companyFlows.length > 0) {
        setSelectedFlow(companyFlows[0]);
      }
    }
  }, [initialCompany]);

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
    padding: '20px'
  };

  const headerStyle = {
    maxWidth: '1400px',
    margin: '0 auto 32px auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px'
  };

  const titleStyle = {
    fontSize: 'clamp(28px, 6vw, 48px)',
    fontWeight: 'bold',
    color: 'white',
    margin: '0 0 8px 0'
  };

  const subtitleStyle = {
    color: '#9ca3af',
    fontSize: '18px',
    margin: 0
  };

  const backButtonStyle = {
    padding: '8px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s ease'
  };

  const mainGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'minmax(280px, 320px) 1fr',
    gap: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
    alignItems: 'start'
  };

  const sidebarStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '20px',
    position: 'sticky',
    top: '20px'
  };

  const sidebarTitleStyle = {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '0 0 16px 0'
  };

  const relevantFlows = sampleFlows.filter(flow => flow.company === selectedCompany.name);

  return React.createElement('div', { style: containerStyle },
    React.createElement('div', { style: headerStyle },
      React.createElement('div', null,
        React.createElement('h1', { style: titleStyle }, 'Agent Flow Debugger'),
        React.createElement('p', { style: subtitleStyle }, 'Analyze AI agent failures across enterprise companies')
      ),
      React.createElement('button', {
        style: backButtonStyle,
        onMouseEnter: (e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)',
        onMouseLeave: (e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)',
        onClick: () => window.location.reload()
      }, '← Back to Landing')
    ),
    React.createElement('div', { 
      style: window.innerWidth <= 768 ? { ...mainGridStyle, gridTemplateColumns: '1fr' } : mainGridStyle 
    },
      React.createElement('div', { style: sidebarStyle },
        React.createElement('h2', { style: sidebarTitleStyle }, '🏢 Companies'),
        React.createElement('div', null,
          ...companies.map(company =>
            React.createElement(CompanyCard, {
              key: company.id,
              company,
              onClick: (selectedComp) => {
                setSelectedCompany(selectedComp);
                const companyFlows = sampleFlows.filter(flow => flow.company === selectedComp.name);
                if (companyFlows.length > 0) {
                  setSelectedFlow(companyFlows[0]);
                }
              },
              isSelected: selectedCompany.id === company.id
            })
          )
        ),
        relevantFlows.length > 0 && React.createElement('div', null,
          React.createElement('h2', { style: { ...sidebarTitleStyle, marginTop: '32px' } }, '🔥 Recent Failures'),
          React.createElement('div', null,
            ...relevantFlows.map(flow =>
              React.createElement('div', {
                key: flow.id,
                style: {
                  padding: '12px',
                  margin: '8px 0',
                  borderRadius: '8px',
                  backgroundColor: selectedFlow.id === flow.id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: selectedFlow.id === flow.id ? '1px solid #6366f1' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                },
                onMouseEnter: (e) => {
                  if (selectedFlow.id !== flow.id) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }
                },
                onMouseLeave: (e) => {
                  if (selectedFlow.id !== flow.id) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }
                },
                onClick: () => setSelectedFlow(flow)
              },
                React.createElement('p', { style: { color: 'white', fontSize: '14px', fontWeight: '500', margin: '0 0 4px 0' } }, 
                  flow.scenario),
                React.createElement('p', { style: { color: '#ef4444', fontSize: '12px', margin: 0, fontWeight: 'bold' } }, 
                  `$${flow.business_impact.financial_loss.toLocaleString()} loss`)
              )
            )
          )
        )
      ),
      React.createElement('div', null,
        relevantFlows.length > 0 ? 
          React.createElement(FlowVisualization, { flow: selectedFlow }) :
          React.createElement('div', {
            style: {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '60px',
              textAlign: 'center'
            }
          },
            React.createElement('div', { style: { fontSize: '64px', marginBottom: '20px' } }, '🎉'),
            React.createElement('h3', { style: { color: 'white', fontSize: '24px', margin: '0 0 16px 0' } }, 
              `No failures recorded for ${selectedCompany.name}`),
            React.createElement('p', { style: { color: '#9ca3af', fontSize: '16px', margin: 0 } }, 
              'This company\'s AI agents are running smoothly! Check back later or explore other companies.'),
            React.createElement('button', {
              style: {
                marginTop: '20px',
                padding: '12px 24px',
                backgroundColor: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              },
              onClick: () => {
                const companiesWithFlows = companies.filter(c => 
                  sampleFlows.some(f => f.company === c.name)
                );
                if (companiesWithFlows.length > 0) {
                  const randomCompany = companiesWithFlows[Math.floor(Math.random() * companiesWithFlows.length)];
                  setSelectedCompany(randomCompany);
                  const companyFlows = sampleFlows.filter(f => f.company === randomCompany.name);
                  setSelectedFlow(companyFlows[0]);
                }
              }
            }, 'Explore Companies with Issues →')
          )
      )
    )
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedCompany, setSelectedCompany] = useState(null);

  const navigateToWorkspace = (company = null) => {
    setSelectedCompany(company);
    setCurrentPage('workspace');
  };

  const navigateToLanding = () => {
    setCurrentPage('landing');
    setSelectedCompany(null);
  };

  // Add responsive CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
      
      body {
        margin: 0;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        overflow-x: hidden;
      }
      
      * {
        box-sizing: border-box;
      }
      
      @media (max-width: 768px) {
        .main-grid {
          grid-template-columns: 1fr !important;
          gap: 16px !important;
        }
        
        .companies-grid {
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important;
          gap: 12px !important;
        }
        
        .sidebar {
          position: static !important;
          margin-bottom: 20px;
        }
      }
      
      @media (max-width: 480px) {
        .companies-grid {
          grid-template-columns: 1fr !important;
        }
      }
      
      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.5);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  if (currentPage === 'workspace') {
    return React.createElement(WorkspacePage, { 
      initialCompany: selectedCompany,
      onNavigateToLanding: navigateToLanding 
    });
  }

  return React.createElement(LandingPage, { 
    onNavigateToWorkspace: navigateToWorkspace 
  });
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
