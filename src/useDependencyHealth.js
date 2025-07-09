import { useEffect, useState } from 'react';

// OSS Index API for Maven: https://ossindex.sonatype.org/rest/v1/component-report
// Accepts purls: https://github.com/package-url/purl-spec

async function fetchOssIndex(purls) {
  const response = await fetch('https://ossindex.sonatype.org/api/v3/component-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/vnd.ossindex.component-report-request.v1+json' },
    body: JSON.stringify({ coordinates: purls }),
  });
  if (!response.ok) throw new Error('Failed to fetch OSS Index');
  return response.json();
}

export default function useDependencyHealth(packages) {
  const [health, setHealth] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!packages || packages.length === 0) return;
    const purls = packages
      .map(pkg => {
        // Find Maven purl
        const ref = (pkg.externalRefs || []).find(r => r.referenceType === 'purl');
        return ref ? ref.referenceLocator : null;
      })
      .filter(Boolean);
    if (purls.length === 0) return;
    setLoading(true);
    fetchOssIndex(purls)
      .then(results => {
        const healthMap = {};
        results.forEach(r => {
          healthMap[r.coordinates] = {
            vulnerabilities: r.vulnerabilities || [],
            reference: r.reference,
            description: r.description,
            latestVersion: r.latestVersion,
            published: r.published,
            // OSS Index does not provide maintenance info, but we can infer from published/latestVersion
          };
        });
        setHealth(healthMap);
        setLoading(false);
      })
      .catch(e => {
        setError(e);
        setLoading(false);
      });
  }, [packages]);

  return { health, loading, error };
}
