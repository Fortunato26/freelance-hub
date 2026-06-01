'use client'

import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { Project, Client, Payment } from '@/types'
import { formatCurrency, formatDate } from '@/utils/format'

Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjQ.woff2' },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hjQ.woff2', fontWeight: 'bold' },
  ],
})

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Inter',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#d4af37',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d4af37',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 30,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d4af37',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  text: {
    fontSize: 11,
    color: '#333333',
    lineHeight: 1.6,
  },
  clientInfo: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  table: {
    width: '100%',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    padding: 10,
  },
  tableHeaderText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    padding: 10,
  },
  tableCell: {
    fontSize: 10,
    color: '#333333',
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#d4af37',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginRight: 20,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d4af37',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#999999',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 10,
  },
})

interface ProposalPDFProps {
  project: Project
  client: Client
  items: Array<{ description: string; value: number }>
}

export function ProposalPDF({ project, client, items }: ProposalPDFProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>FreelanceHub</Text>
          <View>
            <Text style={styles.text}>PROPOSTA COMERCIAL</Text>
            <Text style={styles.text}>Data: {formatDate(new Date())}</Text>
          </View>
        </View>

        <Text style={styles.title}>Proposta: {project.name}</Text>
        <Text style={styles.subtitle}>Prezado(a) {client.name},</Text>

        <View style={styles.section}>
          <Text style={styles.text}>
            {`Segue abaixo nossa proposta para o projeto "${project.name}". Estamos à disposição para esclarecer quaisquer dúvidas.`}
          </Text>
        </View>

        <View style={styles.clientInfo}>
          <Text style={styles.sectionTitle}>Dados do Cliente</Text>
          <Text style={styles.text}>Nome: {client.name}</Text>
          {client.company && <Text style={styles.text}>Empresa: {client.company}</Text>}
          {client.email && <Text style={styles.text}>Email: {client.email}</Text>}
          {client.phone && <Text style={styles.text}>Telefone: {client.phone}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição do Projeto</Text>
          <Text style={styles.text}>{project.description || 'Não especificado'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Itens da Proposta</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { flex: 3 }]}>Descrição</Text>
              <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Valor</Text>
            </View>
            {items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 3 }]}>{item.description}</Text>
                <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>{formatCurrency(item.value)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.total}>
          <Text style={styles.totalLabel}>TOTAL:</Text>
          <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
        </View>

        {project.deadline && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prazo de Entrega</Text>
            <Text style={styles.text}>{formatDate(project.deadline)}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Condições</Text>
          <Text style={styles.text}>
            • Pagamento: 50% na aprovação, 50% na entrega{'\n'}
            • Validade da proposta: 30 dias{'\n'}
            • Alterações no escopo serão orçadas separadamente
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>FreelanceHub - CRM para Freelancers</Text>
          <Text>Este documento foi gerado automaticamente</Text>
        </View>
      </Page>
    </Document>
  )
}

interface ReportPDFProps {
  client?: Client
  projects: Project[]
  payments: Payment[]
  period: { start: Date; end: Date }
}

export function ReportPDF({ client, projects, payments, period }: ReportPDFProps) {
  const totalReceive = payments.filter(p => p.type === 'receive').reduce((sum, p) => sum + p.amount, 0)
  const totalPay = payments.filter(p => p.type === 'pay').reduce((sum, p) => sum + p.amount, 0)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>FreelanceHub</Text>
          <View>
            <Text style={styles.text}>RELATÓRIO</Text>
            <Text style={styles.text}>Período: {formatDate(period.start)} - {formatDate(period.end)}</Text>
          </View>
        </View>

        <Text style={styles.title}>Relatório {client ? `-${ client.name}` : 'Geral'}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo Financeiro</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { flex: 3 }]}>Descrição</Text>
              <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Valor</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 3 }]}>Total Recebido</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'right', color: '#22c55e' }]}>{formatCurrency(totalReceive)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 3 }]}>Total Pago</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'right', color: '#ef4444' }]}>{formatCurrency(totalPay)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 3, fontWeight: 'bold' }]}>Saldo</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'right', fontWeight: 'bold', color: '#d4af37' }]}>{formatCurrency(totalReceive - totalPay)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projetos ({projects.length})</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { flex: 2 }]}>Projeto</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>Status</Text>
              <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Valor</Text>
            </View>
            {projects.map((project, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>{project.name}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{project.status}</Text>
                <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>{formatCurrency(project.value)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text>FreelanceHub - CRM para Freelancers</Text>
          <Text>Relatório gerado em {formatDate(new Date())}</Text>
        </View>
      </Page>
    </Document>
  )
}
