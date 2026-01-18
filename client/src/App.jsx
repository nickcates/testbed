import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import ImportDialog from './components/ImportDialog';
import { fetchLeads, importLeads, enrichAllLeads } from './services/api';

function App() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    state: '',
    minScore: ''
  });

  useEffect(() => {
    loadLeads();
  }, [filters]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await fetchLeads(filters);
      setLeads(data);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (importConfig) => {
    try {
      await importLeads(importConfig);
      setShowImportDialog(false);
      loadLeads();
    } catch (error) {
      console.error('Error importing leads:', error);
      alert('Failed to import leads');
    }
  };

  const handleEnrichAll = async () => {
    if (!confirm('This will enrich all unenriched leads. Continue?')) return;

    try {
      await enrichAllLeads();
      loadLeads();
      alert('Enrichment started. This may take a while.');
    } catch (error) {
      console.error('Error enriching leads:', error);
      alert('Failed to enrich leads');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onImport={() => setShowImportDialog(true)}
        onEnrichAll={handleEnrichAll}
        leadsCount={leads.length}
      />

      <Dashboard
        leads={leads}
        loading={loading}
        filters={filters}
        onFilterChange={setFilters}
        onRefresh={loadLeads}
      />

      {showImportDialog && (
        <ImportDialog
          onClose={() => setShowImportDialog(false)}
          onImport={handleImport}
        />
      )}
    </div>
  );
}

export default App;
