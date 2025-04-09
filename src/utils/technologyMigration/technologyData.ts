
// This file contains the data structure that can be extracted from our existing TechnologyLanding page
// to convert into database records

export function useTechnologyData() {
  return {
    title: 'Enterprise-Grade Technology',
    description: 'Our platform is built with security, scalability, and flexibility in mind. Connect any machine to our cloud infrastructure and unlock powerful retail automation capabilities.',
    sections: [
      {
        type: 'architecture',
        title: 'Cloud-Native Architecture',
        description: 'Our platform connects your machines to the cloud, enabling real-time monitoring, data analysis, and seamless integration with your business systems.',
        features: [
          {
            title: 'Edge Computing',
            description: 'Local processing at the machine level ensures continued operation even during connectivity interruptions.',
            icon: 'Network',
            items: [
              'Offline transaction capability',
              'Local data caching',
              'Secure boot process'
            ]
          },
          {
            title: 'Cloud Backend',
            description: 'Serverless architecture ensures automatic scaling and high availability for your retail automation platform.',
            icon: 'UploadCloud',
            items: [
              '99.99% uptime SLA',
              'Automatic scaling',
              'Multi-region redundancy'
            ]
          },
          {
            title: 'APIs & Webhooks',
            description: 'Comprehensive API suite allows seamless integration with your existing systems and third-party services.',
            icon: 'ArrowDownToLine',
            items: [
              'RESTful and GraphQL APIs',
              'Real-time event notifications',
              'Standard OAuth2 authentication'
            ]
          }
        ]
      },
      {
        type: 'security',
        title: 'Enterprise Security',
        description: 'Our platform meets the highest industry standards for data protection, network security, and compliance requirements.',
        features: [
          {
            title: 'Data Protection',
            description: 'End-to-end encryption for all data in transit and at rest, with regular security audits and penetration testing.',
            icon: 'ShieldCheck',
            items: [
              'AES-256 encryption',
              'Role-based access control',
              'Secure key management',
              'Regular security audits'
            ]
          },
          {
            title: 'Compliance',
            description: 'Our platform meets industry standards and regulatory requirements for secure payment processing and data handling.',
            icon: 'CreditCard',
            items: [
              'PCI DSS Level 1 certified',
              'GDPR compliant',
              'SOC 2 Type II audited',
              'HIPAA compliance available'
            ]
          }
        ]
      },
      {
        type: 'integration',
        title: 'Third-Party Integrations',
        description: 'Connect your vending operations with your existing business systems and third-party services for seamless data flow and process automation.',
        features: [
          {
            title: 'ERP Systems',
            description: 'Bidirectional integration with major ERP systems including SAP, Oracle, and Microsoft Dynamics.',
            icon: 'Database',
            items: [
              'Inventory synchronization',
              'Financial data integration',
              'Master data management'
            ]
          },
          {
            title: 'CRM Platforms',
            description: 'Connect customer data with Salesforce, HubSpot, and other major CRM platforms.',
            icon: 'Users',
            items: [
              'Customer profile integration',
              'Purchase history tracking',
              'Loyalty program integration'
            ]
          },
          {
            title: 'Marketing Tools',
            description: 'Connect with email marketing, SMS, and digital advertising platforms.',
            icon: 'Mail',
            items: [
              'Campaign automation',
              'Promotion management',
              'Customer segment targeting'
            ]
          }
        ]
      }
    ]
  };
}
